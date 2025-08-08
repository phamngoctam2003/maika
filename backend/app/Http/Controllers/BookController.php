<?php

namespace App\Http\Controllers;

use App\Services\BookService;
use Illuminate\Http\Request;

class BookController extends Controller
{
    protected BookService $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['page', 'keyword', 'sort_order', 'per_page']);
            $books = $this->bookService->getAllBooks($filters);
            return response()->json($books);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách books.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|array|max:255',
            'description' => 'nullable|string',
            'publication_year' => 'required|integer|min:1900|max:' . date('Y'),
            'file_path' => 'required|file',
            'access_type' => 'required|string',
            'category_id' => 'required|array|exists:categories,id',
            'format_id' => 'required|array|exists:book_formats,id',
        ]);
        try {
            $this->bookService->createBook($validatedData);
            return response()->json([
                'message' => 'Sách đã được tạo thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $booktype = $this->bookService->getBookById($id);
            if (!$booktype) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            return response()->json($booktype);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông tin sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|array|max:255',
            'description' => 'nullable|string',
            'publication_year' => 'required|integer|min:1900|max:' . date('Y'),
            'file_path' => 'nullable|file',
            'access_type' => 'required|string',
            'category_id' => 'required|array|exists:categories,id',
            'format_id' => 'required|array|exists:book_formats,id',
        ]);
        try {
            $book = $this->bookService->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            $updatedBook = $this->bookService->updateBook($id, $validatedData);
            return response()->json([
                'message' => 'Sách đã được cập nhật thành công.',
                'book' => $updatedBook
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cập nhật sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllFormats()
    {
        try {
            $formats = $this->bookService->getAllFormats();
            return response()->json($formats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách định dạng sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getAuthors()
    {
        try {
            $authors = $this->bookService->getAuthors();
            return response()->json($authors);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách tác giả.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        $ids = $request->ids;
        try {
            foreach ($ids as $id) {
                $book = $this->bookService->getBookById($id);
                if (!$book) {
                    return response()->json(['message' => 'Sách không tồn tại.'], 404);
                }
            }
            $result = $this->bookService->deleteBooks($ids);
            if ($result) {
                return response()->json(['message' => 'Xóa thành công', 'status' => 200]);
            } else {
                return response()->json(['message' => 'Xóa thất bại', 'status' => 'error'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa sách.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
