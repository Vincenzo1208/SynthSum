import React, { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "../services/article";

const Hero = () => {
  const [sampleSummary, setSampleSummary] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [activeWord, setActiveWord] = useState(0);
  const words = [
    "Summarize",
    "Condense",
    "Distill",
    "Synthesize",
    "Analyze",
    "Extract",
    "Simplify",
    "Clarify"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSummary = async () => {
    const sampleArticleUrl = "https://en.wikipedia.org/wiki/Artificial_intelligence";
    try {
      const { data } = await getSummary({ articleUrl: sampleArticleUrl });
      if (data?.summary) {
        setSampleSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching summary: ", error);
    }
  };

  return (
    <header className='w-[1250px] min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 text-white py-12 px-4'>
      <nav className='flex justify-between items-center w-full max-w-7xl px-6 mb-20'>
        <div className="flex items-center">
          <svg className="w-10 h-10 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            SynthSum
          </span>
        </div>
        <button
          type='button'
          onClick={() => window.open("https://github.com/Vincenzo1208", "_blank")}
          className='bg-white text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center'
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
      </nav>

      <div className='text-center max-w-4xl mx-auto px-6'>
        <h1 className='text-5xl md:text-7xl font-extrabold mb-8 leading-tight animate-fade-in-up'>
          <span className='bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text animate-gradient-x'>
            {words[activeWord]}
          </span>
          <br className='hidden md:block' />
          Articles with AI Precision
        </h1>
        <div className="flex justify-center items-center space-x-4 mb-8 animate-fade-in-up delay-300">
          {words.map((word, index) => (
            <span
              key={word}
              className={`text-sm md:text-base font-bold transition-all duration-300 ${
                index === activeWord
                  ? 'scale-125 text-pink-500'
                  : 'scale-100 text-gray-400 opacity-70'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
        <h2 className='text-xl md:text-2xl font-light max-w-2xl mx-auto mb-12 animate-fade-in-up delay-300'>
          Experience the future of reading with SynthSum, your AI-powered article summarizer
          that distills complex content into crystal-clear insights
        </h2>
        <div className="flex flex-col items-center space-y-6 animate-fade-in-up delay-600">
          <button 
            onClick={handleQuickSummary}
            disabled={isFetching}
            className="bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
          >
            {isFetching ? "Summarizing..." : "Try Instant Summary"}
          </button>
          {error && (
            <p className="text-red-400 text-sm">Oops! Something went wrong. Please try again.</p>
          )}
          {sampleSummary && (
            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg max-w-2xl">
              <h3 className="text-xl font-semibold mb-2">Sample Summary:</h3>
              <p className="text-sm text-gray-300">{sampleSummary.slice(0, 200)}...</p>
              <p className="text-xs text-gray-400 mt-2">
                This is just a glimpse. Use the tool below for full summaries!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-500 to-transparent -z-10 rounded-full"></div>
    </header>
  );
};

export default Hero;

