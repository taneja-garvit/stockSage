import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

function News() {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchNewsData = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/news?page=${pageNum}`);
      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      setError('Failed to fetch news data');
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchNewsData(page);
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="mt-16 min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-4">Diversified Indian Stock Market News</h1>
          </header>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-6" role="alert">
                  <p>{error}</p>
                </div>
              )}

              {newsData && newsData.data && (
                <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                  <div className="max-h-full overflow-y-auto pr-2 mb-4">
                    {newsData.data.map((article, index) => (
                      <Fragment key={article.uuid || index}>
                        {index > 0 && <div className="border-t border-gray-700 my-4"></div>}
                        <div className="p-4 hover:bg-gray-700 transition duration-200 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2 text-gray-100">{article.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-blue-900 text-blue-100 text-xs font-medium px-2 py-1 rounded-full">
                              {article.source}
                            </span>
                            {article.entities.map((e, idx) => (
                              <span
                                key={idx}
                                className="bg-green-900 text-green-100 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {e.symbol}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-300 mb-3">
                            {article.description || 'No description available'}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {article.image_url && (
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full sm:w-1/4 h-auto rounded object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} // Hide if broken
                              />
                            )}
                            <div className="flex-1">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-blue-400 font-medium hover:text-blue-300 hover:underline mb-2"
                              >
                                Read full article
                              </a>
                              <p className="text-gray-400 text-sm">
                                Published: {new Date(article.published_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <button
                      onClick={() => setPage(page > 1 ? page - 1 : 1)}
                      disabled={loading || page === 1}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-700 rounded-lg text-gray-200 font-medium">
                      Page {page} of {Math.ceil(newsData?.meta?.found / newsData?.meta?.limit) || 'N/A'}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={loading || page >= Math.ceil(newsData?.meta?.found / newsData?.meta?.limit)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default News;