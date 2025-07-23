"use client";

import React, { useEffect, useState } from 'react';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { twMerge } from "tailwind-merge";
import { Field, Label } from "@headlessui/react";

interface SearchResult {
  topic: string;
  score: number;
}

interface SemanticSearchProps {
  className?: string;
  topics: string[];
}

export default function SemanticSearch({ className, topics }: SemanticSearchProps) {
  const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);
  const [embeddings, setEmbeddings] = useState<tf.Tensor2D | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load the model and embed topics
  useEffect(() => {
    const loadModelAndEmbed = async () => {
      if (topics.length === 0) return; // Don't proceed if no topics
      
      setIsModelLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      try {
        // Simulate progress for model loading
        setSearchStatus('Initializing AI model...');
        setLoadingProgress(25);
        
        const loadedModel = await use.load();
        setLoadingProgress(60);
        setModel(loadedModel);
        
        setSearchStatus('Processing research topics...');
        setLoadingProgress(80);
        
        const topicEmbeddings = await loadedModel.embed(topics);
        setEmbeddings(topicEmbeddings);
        
        setLoadingProgress(100);
        setSearchStatus('Ready for search!');
        
        // Clear loading state after a brief delay
        setTimeout(() => {
          setIsModelLoading(false);
          setSearchStatus('');
        }, 1000);
        
      } catch (err) {
        console.error('Error loading model or embeddings:', err);
        setError('Failed to initialize search. Please refresh the page and try again.');
        setIsModelLoading(false);
        setSearchStatus('');
      }
    };
    loadModelAndEmbed();
  }, [topics]);

  const handleSearch = async () => {
    if (!model || !query || !embeddings) return;

    setIsSearching(true);
    setSearchStatus('Analyzing your query...');
    setError(null);

    try {
      const queryEmbedding = await model.embed([query]);
      setSearchStatus('Computing similarities...');
      
      const scores = await computeSimilarities(queryEmbedding, embeddings);

      const topMatches = scores
        .map((score: number, i: number) => ({ topic: topics[i], score }))
        .sort((a: SearchResult, b: SearchResult) => b.score - a.score)
        .slice(0, 5); // top 5 matches

      setResults(topMatches);
      setSearchStatus(`Search completed. Found ${topMatches.length} matches for "${query}".`);
      
      // Clear search status after showing results
      setTimeout(() => setSearchStatus(''), 3000);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setSearchStatus('');
    } finally {
      setIsSearching(false);
    }
  };

  const computeSimilarities = async (queryVec: tf.Tensor2D, topicVecs: tf.Tensor2D): Promise<number[]> => {
    const dotProduct = tf.matMul(topicVecs, queryVec, false, true).arraySync() as number[][];
    const queryNorm = tf.norm(queryVec, 2).arraySync() as number;
    const topicNorms = tf.norm(topicVecs, 2, 1).arraySync() as number[];
    
    return dotProduct.map((val: number[], i: number) => {
      const dot = val[0];
      const topicNorm = topicNorms[i];
      
      // Handle edge cases to prevent NaN
      if (queryNorm === 0 || topicNorm === 0 || !isFinite(dot) || !isFinite(queryNorm) || !isFinite(topicNorm)) {
        return 0;
      }
      
      const similarity = dot / (queryNorm * topicNorm);
      return isFinite(similarity) ? Math.max(0, Math.min(1, similarity)) : 0; // Clamp between 0 and 1
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="bg-grey-light-bg border-t-4 border-yellow w-full -m-1">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {searchStatus}
      </div>
      
      {/* Loading Progress Bar */}
      {isModelLoading && (
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-500 ease-out"
            style={{ width: `${loadingProgress}%` }}
            role="progressbar"
            aria-valuenow={loadingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Model loading progress"
          />
        </div>
      )}
      
      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>
        {/* Status Messages */}
        {(isModelLoading || isSearching || error) && (
          <div className="w-full mb-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {(isModelLoading || isSearching) && !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 font-medium">{searchStatus}</p>
                  {isModelLoading && (
                    <p className="text-blue-600 text-sm mt-1">
                      This may take a moment on slower devices...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter research topic or keyword..."
              disabled={!model || topics.length === 0 || isModelLoading}
              aria-label="Search for research topics"
            >
              <span className="text-l font-bold mb-1">Semantic Search by Research Topic</span>
            </TextInput>
          </div>

          <div className="flex items-end">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!model || !query || topics.length === 0 || isSearching || isModelLoading}
              aria-describedby={topics.length === 0 ? 'no-topics-message' : undefined}
            >
              {isSearching && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSearching ? 'Searching...' : 
               isModelLoading ? 'Loading...' : 
               !model ? 'Initializing...' : 
               topics.length === 0 ? 'No Topics' : 'Search'}
            </button>
          </div>
        </form>
      </Container>

      {topics.length === 0 && (
        <Container className="pb-8">
          <div id="no-topics-message" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No research topics available at the moment.</p>
          </div>
        </Container>
      )}

      {/* Performance Tip - shown during initial loading */}
      {isModelLoading && (
        <Container className="pb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Performance Tip</h4>
            <p className="text-blue-700 text-sm">
              The AI model is loading for the first time. This typically takes 10-30 seconds depending on your device and internet connection. 
              Once loaded, searches will be much faster!
            </p>
          </div>
        </Container>
      )}

      {results.length > 0 && (
        <Container className="pb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6" role="region" aria-labelledby="search-results-heading">
            <h3 id="search-results-heading" className="text-xl font-bold mb-4 text-gray-800">
              Top Research Matches ({results.length} results):
            </h3>
            <ul className="space-y-3" role="list">
              {results.map((res, i) => (
                <li 
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-700">{res.topic}</span>
                  <span 
                    className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full"
                    aria-label={`${(res.score * 100).toFixed(1)} percent match`}
                  >
                    {(res.score * 100).toFixed(1)}% match
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      )}
    </div>
  );
}
