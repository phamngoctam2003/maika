<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChapterService;

class ChapterController extends Controller
{
 protected ChapterService $chapterService;

    public function __construct(ChapterService $chapterService)
    {
        $this->chapterService = $chapterService;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['book_id', 'page', 'keyword', 'sort_order', 'per_page']);
            $chapters = $this->chapterService->getAllChapters($filters);
            return response()->json($chapters);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách chapter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'book_id' => 'required|exists:books,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'audio_path' => 'nullable|string',
            'chapter_order' => 'required|integer',
            'expected_chapters' => 'nullable|integer',
            'status' => 'integer',
        ]);
        try {
            $this->chapterService->createBook($validatedData);
            return response()->json([
                'message' => 'Chương đã được tạo thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo chương.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $book = $this->chapterService->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            return response()->json($book);
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
            'name' => 'required|string|max:255|unique:book_types,name,' . $id,
            'category_id' => 'required|exists:categories,id',
        ]);
        try {
            $book = $this->chapterService->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Sách không tồn tại.'], 404);
            }
            $updatedBook = $this->chapterService->updateBook($id, $validatedData);
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

}
