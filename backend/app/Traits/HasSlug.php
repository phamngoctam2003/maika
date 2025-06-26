<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug()
    {
        static::saving(function ($model) {
            $source = $model->getSlugSourceColumn();  // lấy cột làm slug
            $slugColumn = $model->getSlugColumn(); // cột slug trong DB

            if ($model->isDirty($source)) {
                $slug = Str::slug($model->$source);

                $count = static::where($slugColumn, $slug)
                    ->where('id', '!=', $model->id) // loại trừ bản ghi hiện tại
                    ->count();

                if ($count > 0) {
                    $slug .= '-' . ($count + 1); // thêm hậu tố nếu slug đã tồn tại
                }
                $model->$slugColumn = $slug; // gán giá trị slug vào cột slug
            }
        });
    }

    protected function getSlugSourceColumn()
    {
        return property_exists($this, 'slugFrom') ? $this->slugFrom : 'title'; // cột mặc định là 'name'
    }

    protected function getSlugColumn()
    {
        return property_exists($this, 'slugColumn') ? $this->slugColumn : 'slug'; // cột slug mặc định là 'slug'
    }
}
