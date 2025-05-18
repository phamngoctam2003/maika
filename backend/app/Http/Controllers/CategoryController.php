<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        return response()->json([
            'category' => $category,
        ]);

    }
}
