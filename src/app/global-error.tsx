'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Something went wrong!</h2>
                    <p>{error.message}</p>
                    <button
                        onClick={() => reset()}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'black', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
