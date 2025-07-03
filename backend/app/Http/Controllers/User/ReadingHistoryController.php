<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ReadingHistory;
use App\Services\ReadingHistoryService;
use Illuminate\Http\Request;

class ReadingHistoryController extends Controller
{

    protected ReadingHistoryService $service;
    public function __construct(ReadingHistoryService $service)
    {
        $this->service = $service;
    }
    public function save(Request $request)
    {
        $validated = $request->validate(
            [
                'book_slug' => 'required|string',
                'chapter_id' => 'nullable|integer',
                'chapter_index' => 'required|integer',
                'character_position' => 'required|integer',
                'chapter_progress' => 'required|numeric|min:0|max:100',
            ]
        );
        try {
            $this->service->saveProgress($validated);
            return response()->json(['message' => 'Save successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getProgress($slug)
    {
        try {
            $progress = $this->service->getProgress($slug);
            if (!$progress) {
                return response()->json(['message' => 'not found'], 404);
            }
            return response()->json($progress, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
