<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ContactMessage;
use App\Models\SupportReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Customer inbox: website contact-form messages (SRS-16) and in-app problem
 * reports. They are two tables but one screen, so they share a controller.
 */
class InboxController extends AdminController
{
    private const MESSAGE_STATUSES = ['new', 'read', 'replied', 'spam'];

    private const REPORT_STATUSES = ['new', 'read', 'resolved'];

    public function messages(Request $request): JsonResponse
    {
        $messages = ContactMessage::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(fn ($inner) => $inner->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('subject', 'like', $term));
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->latest()
            ->paginate($this->perPage($request));

        return $this->paginated($messages, fn (ContactMessage $m) => [
            'id' => $m->id,
            'name' => $m->name,
            'email' => $m->email,
            'phone' => $m->phone,
            'subject' => $m->subject,
            'message' => $m->message,
            'status' => $m->status,
            'admin_notes' => $m->admin_notes,
            'created_at' => $m->created_at,
        ], 'Messages retrieved successfully');
    }

    public function updateMessage(Request $request, ContactMessage $message): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(self::MESSAGE_STATUSES)],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $message->update($data);

        return $this->ok($message->fresh(), 'Message updated successfully');
    }

    public function destroyMessage(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return $this->ok(null, 'Message deleted successfully');
    }

    public function reports(Request $request): JsonResponse
    {
        $reports = SupportReport::query()
            ->with('user:id,username,email')
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(fn ($inner) => $inner->where('message', 'like', $term)
                    ->orWhere('order_number', 'like', $term)
                    ->orWhere('issue_type', 'like', $term));
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->latest()
            ->paginate($this->perPage($request));

        return $this->paginated($reports, fn (SupportReport $r) => [
            'id' => $r->id,
            'issue_type' => $r->issue_type,
            'order_number' => $r->order_number,
            'message' => $r->message,
            'status' => $r->status,
            'user' => $r->user ? ['id' => $r->user->id, 'name' => $r->user->username, 'email' => $r->user->email] : null,
            'created_at' => $r->created_at,
        ], 'Support reports retrieved successfully');
    }

    public function updateReport(Request $request, SupportReport $report): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(self::REPORT_STATUSES)],
        ]);

        $report->update($data);

        return $this->ok($report->fresh(), 'Support report updated successfully');
    }

    public function destroyReport(SupportReport $report): JsonResponse
    {
        $report->delete();

        return $this->ok(null, 'Support report deleted successfully');
    }
}
