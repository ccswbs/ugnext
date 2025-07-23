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

  // Load the model and embed topics
  useEffect(() => {
    const loadModelAndEmbed = async () => {
      if (topics.length === 0) return; // Don't proceed if no topics
      
      const loadedModel = await use.load();
      setModel(loadedModel);
      const topicEmbeddings = await loadedModel.embed(topics);
      setEmbeddings(topicEmbeddings);
    };
    loadModelAndEmbed();
  }, [topics]);

  const handleSearch = async () => {
    if (!model || !query || !embeddings) return;

    setSearchStatus('Searching...');

    const queryEmbedding = await model.embed([query]);
    const scores = await computeSimilarities(queryEmbedding, embeddings);

    const topMatches = scores
      .map((score: number, i: number) => ({ topic: topics[i], score }))
      .sort((a: SearchResult, b: SearchResult) => b.score - a.score)
      .slice(0, 5); // top 5 matches

    setResults(topMatches);
    setSearchStatus(`Search completed. Found ${topMatches.length} matches for "${query}".`);
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
      
      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter research topic or keyword..."
              disabled={!model || topics.length === 0}
              aria-label="Search for research topics"
            >
              <span className="text-l font-bold mb-1">Semantic Search by Research Topic</span>
            </TextInput>
          </div>

          <div className="flex items-end">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!model || !query || topics.length === 0}
              aria-describedby={topics.length === 0 ? 'no-topics-message' : undefined}
            >
              {!model ? 'Loading...' : topics.length === 0 ? 'No Topics' : 'Search'}
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
