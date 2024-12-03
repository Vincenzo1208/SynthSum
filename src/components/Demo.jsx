import React, { useState, useEffect } from "react";
import { FaLink, FaCopy, FaCheck } from 'react-icons/fa';
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );
  
    if (existingArticle) return setArticle(existingArticle);
  
    try {
      const { data } = await getSummary({ articleUrl: article.url });
      if (data?.summary) {
        const newArticle = { ...article, summary: data.summary };
        const updatedAllArticles = [newArticle, ...allArticles];
  
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      }
    } catch (error) {
      console.error("Error fetching summary: ", error);
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section className='mt-16 w-full max-w-xl mx-auto px-4'>
      <div className='flex flex-col w-full gap-4'>
        <form
          className='relative flex justify-center items-center -mt-5'
          onSubmit={handleSubmit}
        >
          <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='w-full rounded-full py-3 pl-12 pr-20 bg-gray-800 text-white border-2 border-gray-700 focus:border-pink-500 focus:outline-none shadow-lg transition-all duration-300'
          />
          <button
            type='submit'
            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full px-4 py-2 hover:from-pink-600 hover:to-violet-600 transition-all duration-300'
          >
            Synthesize
          </button>
        </form>

        <div className='flex flex-col gap-2 max-h-60 overflow-y-auto bg-gray-800 rounded-lg p-4'>
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-all duration-200 cursor-pointer flex items-center'
            >
              <div className='mr-3 cursor-pointer' onClick={() => handleCopy(item.url)}>
                {copied === item.url ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <FaCopy className="text-gray-400 hover:text-white transition-colors duration-200" />
                )}
              </div>
              <p className='flex-1 font-medium text-sm text-gray-300 truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
        ) : error ? (
          <p className='font-bold text-red-500 text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-normal text-gray-400'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3 bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-pink-500/10 w-full'>
              <h2 className='font-bold text-white text-2xl mb-4'>
                Article <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='text-gray-300 leading-relaxed'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;

