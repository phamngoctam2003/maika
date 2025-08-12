<?php

namespace App\Repositories;

use App\Contracts\BookRepositoryInterface;
use App\Models\Role;
use App\Models\Books;
use App\Models\Author;
use App\Models\BookFormat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Chapter;
use Illuminate\Support\Facades\Storage;


class BookRepository implements BookRepositoryInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Books::with('categories', 'formats');

        if (isset($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%');
        }

        // Sort
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy('created_at', $sortOrder);

        // Paginate
        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }


    public function getById(int $id): ?Books
    {
        return Books::with('formats', 'authors', 'categories', 'book_format_mappings')->where('id', $id)->first();
    }

    public function create(array $data): Books
    {
        return DB::transaction(function () use ($data) {
            $authorIds = [];
            $path = $data['file_path']->storePublicly('books', 'public');
            $data['file_path'] = $path;
            $categoryIds = $data['category_id'] ?? [];
            $authors = $data['author'] ?? [];
            $formatId = $data['format_id'] ?? [];

            // Unset các field không thuộc về books table
            unset($data['category_id'], $data['format_id'], $data['author']);

            foreach ($authors as $author) {
                if (empty($author)) continue; // Skip empty values

                if (is_numeric($author)) {
                    $existingAuthor = Author::find((int) $author);
                    if ($existingAuthor) {
                        $authorIds[] = $existingAuthor->id;
                    } else {
                        continue;
                    }
                } else {
                    // Validate tên author
                    $authorName = trim($author);
                    if (empty($authorName)) continue;

                    try {
                        // Sử dụng updateOrCreate để tránh race condition
                        $authorModel = Author::updateOrCreate(
                            ['name' => $authorName],
                            ['name' => $authorName, 'updated_at' => now()]
                        );

                        if ($authorModel && $authorModel->id) {
                            $authorIds[] = $authorModel->id;
                        }
                    } catch (\Exception $e) {
                        continue;
                    }
                }
            }

            // Tạo book
            $book = Books::create($data);

            if (!empty($categoryIds)) {
                $book->categories()->sync($categoryIds);
            }

            if (!empty($formatId)) {
                $book->formats()->sync($formatId);
            }

            if (!empty($authorIds)) {
                // Kiểm tra lại authors trước khi sync
                $validAuthorIds = Author::whereIn('id', $authorIds)->pluck('id')->toArray();
                if (!empty($validAuthorIds)) {
                    $book->authors()->sync($validAuthorIds);
                }
            }

            return $book;
        });
    }

    public function update(int $id, array $data): ?Books
    {
        return DB::transaction(function () use ($id, $data) {
            $Books = $this->getById($id);
            if (!$Books) {
                return null;
            }

            $authorIds = [];
            // Xử lý file_path nếu có upload mới
            if (isset($data['file_path']) && is_object($data['file_path'])) {
                $path = $data['file_path']->storePublicly('books', 'public');
                $data['file_path'] = $path;
            } else {
                unset($data['file_path']); // Không update nếu không có file mới
            }

            $categoryIds = $data['category_id'] ?? [];
            $authors = $data['author'] ?? [];
            $formatId = $data['format_id'] ?? [];

            // Unset các field không thuộc về books table
            unset($data['category_id'], $data['format_id'], $data['author']);

            foreach ($authors as $author) {
                if (empty($author)) continue;
                if (is_numeric($author)) {
                    $existingAuthor = Author::find((int) $author);
                    if ($existingAuthor) {
                        $authorIds[] = $existingAuthor->id;
                    } else {
                        continue;
                    }
                } else {
                    $authorName = trim($author);
                    if (empty($authorName)) continue;
                    try {
                        $authorModel = Author::updateOrCreate(
                            ['name' => $authorName],
                            ['name' => $authorName, 'updated_at' => now()]
                        );
                        if ($authorModel && $authorModel->id) {
                            $authorIds[] = $authorModel->id;
                        }
                    } catch (\Exception $e) {
                        continue;
                    }
                }
            }

            // Update book
            $Books->update($data);

            // Đồng bộ các quan hệ
            if (!empty($categoryIds)) {
                $Books->categories()->sync($categoryIds);
            } else {
                $Books->categories()->detach();
            }

            if (!empty($formatId)) {
                $Books->formats()->sync($formatId);
            } else {
                $Books->formats()->detach();
            }

            if (!empty($authorIds)) {
                $validAuthorIds = Author::whereIn('id', $authorIds)->pluck('id')->toArray();
                if (!empty($validAuthorIds)) {
                    $Books->authors()->sync($validAuthorIds);
                }
            } else {
                $Books->authors()->detach();
            }

            return $Books;
        });
    }

    public function delete(array $ids): ?bool
    {
        if (is_array($ids) && !empty($ids)) {
            if (empty($ids)) return false;
            // Lấy tất cả các mapping id của sách cần xóa
            $mappingIds = \App\Models\BookFormatMapping::whereIn('book_id', $ids)->pluck('id')->toArray();
            // Lấy tất cả các chương thuộc các mapping này
            $chapters = Chapter::whereIn('book_format_mapping_id', $mappingIds)->get();
            foreach ($chapters as $chapter) {
                if ($chapter->audio_path && Storage::disk('public')->exists($chapter->audio_path)) {
                    Storage::disk('public')->delete($chapter->audio_path);
                }
            }
            // Xóa file hình ảnh của sách
            $books = Books::whereIn('id', $ids)->get();
            foreach ($books as $book) {
                if ($book->file_path && Storage::disk('public')->exists($book->file_path)) {
                    Storage::disk('public')->delete($book->file_path);
                }
            }
            // Xóa sách
            Books::whereIn('id', $ids)->delete();
            return true;
        }
        return false;
    }



    public function search(string $query): LengthAwarePaginator
    {
        return Books::where('title', 'like', '%' . $query . '%')->paginate();
    }

    // public function getCategoriesWithProducts(): LengthAwarePaginator
    // {
    //     return Category::with('products')->paginate(10);
    // }



}
