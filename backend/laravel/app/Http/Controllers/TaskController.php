<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return Task::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text'         => 'required|string|max:255',
            'min_duration' => 'required|integer|min:0',
            'max_duration' => 'required|integer|min:0|gte:min_duration',
        ]);

        $task = Task::create([
            'text'         => $validated['text'],
            'min_duration' => $validated['min_duration'],
            'max_duration' => $validated['max_duration'],
            'completed'    => false,
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'completed'    => 'sometimes|boolean',
            'text'         => 'sometimes|string|max:255',
            'min_duration' => 'sometimes|integer|min:0',
            'max_duration' => 'sometimes|integer|min:0|gte:min_duration',
        ]);

        $task->update($validated);

        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'total_minutes' => 'required|integer|min:0',
        ]);
        $remaining = $validated['total_minutes'];
        $tasks = Task::all()->shuffle();

        if ($tasks->isEmpty()) {
            return response()->json([
                'message' => 'タスクがありません'
            ], 404);
        }

        $result = [];

        foreach ($tasks as $task) {
            if ($remaining < 5) {
                break;
            }

            //このタスクに割り当てられる最大時間は「タスクの
            $maxForThis = min($task->max_duration,$remaining);

            if ($maxForThis < $task->min_duration) {
                continue;
            }

            $minSlots = intdiv($task->min_duration + 4, 5); // 例: 6分→2スロット(10分)
            $maxSlots = intdiv($maxForThis, 5); 
            
            if ($maxSlots < $minSlots) {
                continue;
            }// 例: 23分→4スロット(20分)

            $slot = random_int($minSlots, $maxSlots);
            $minutes = $slot * 5;

            $result[] = [
                'id'          => $task->id,
                'text'        => $task->text,
                'completed'   => $task->completed,
                'min_duration' => $task->min_duration,
                'max_duration' => $task->max_duration,
                'duration' => $minutes,
            ];

            $remaining -= $minutes;
        }

        return response()->json($result);
    }
}