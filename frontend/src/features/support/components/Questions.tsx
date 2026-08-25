import { useFaqsManagement } from '@/features/support';

export default function Questions() {
  const { faqs, meta, page, setPage, isLoading, isError, error } = useFaqsManagement();

  if (isLoading && !faqs.length) {
    return <p className="text-grocery-600 text-sm">Loading…</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm" role="alert">
        {error instanceof Error ? error.message : 'Could not load FAQs.'}
      </p>
    );
  }

  const lastPage = meta?.last_page ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < lastPage;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

      <div className="flex flex-col gap-4">
        {faqs.length === 0 ? (
          <p className="text-sm text-grocery-600">No questions found.</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="rounded-lg bg-[#DAD8D8] p-3">
              {faq.category ? (
                <span className="text-xs font-medium text-grocery-700">{faq.category}</span>
              ) : null}
              <h3 className="my-2 font-semibold">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))
        )}
      </div>

      {meta && meta.last_page > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
          <button
            type="button"
            className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoPrev || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>

          <p className="text-sm text-grocery-700 tabular-nums">
            Page {meta.current_page} of {meta.last_page}
            {meta.from != null && meta.to != null ? (
              <span className="text-grocery-500">
                {' '}
                ({meta.from}–{meta.to} of {meta.total})
              </span>
            ) : null}
          </p>

          <button
            type="button"
            className="rounded-lg border border-black/20 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoNext || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
