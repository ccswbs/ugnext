"use client";

import { Checkbox } from "@uoguelph/react-components/checkbox";
import { TextInput } from "@uoguelph/react-components/text-input";
import { Container } from "@uoguelph/react-components/container";
import { useSearch, nameAndTagSearch } from "@/lib/use-search";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Select, SelectOptions, SelectOption, SelectButton } from "@uoguelph/react-components/select";
import { Field, Label } from "@headlessui/react";
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

type Profile = {
  id: string;
  name: string;
  research?: { id: string; name: string }[];
  units?: { id: string; name: string }[];
  // Add other properties as needed
};

type Unit = {
  id: string;
  name: string;
  // Add other properties as needed
};

type FacultySearchBarProps = {
  profiles: Profile[];
  units: Unit[];
  researchTopics?: string[]; // Research topics for semantic search
  onChange?: (filtered: Profile[]) => void;
  className?: string;
};

export const FacultySearchBar = ({ profiles, units, researchTopics = [], onChange, className }: FacultySearchBarProps) => {
  
  const [input, setInput] = useState("");
  const results = useSearch(profiles, input, nameAndTagSearch);
  const [selectedUnits, setSelectedUnits] = useState(units?.map(unit => unit.id) ?? []);

  // Semantic search states
  const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);
  const [embeddings, setEmbeddings] = useState<tf.Tensor2D | null>(null);
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState<string[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load semantic search model and embed topics
  useEffect(() => {
    const loadModelAndEmbed = async () => {
      if (researchTopics.length === 0) return;
      
      setIsModelLoading(true);
      setError(null);
      
      try {
        setSearchStatus('Initializing AI model...');
        const loadedModel = await use.load();
        setModel(loadedModel);
        
        setSearchStatus('Processing research topics...');
        const topicEmbeddings = await loadedModel.embed(researchTopics);
        setEmbeddings(topicEmbeddings);
        
        setSearchStatus('Ready for semantic search!');
        setTimeout(() => {
          setIsModelLoading(false);
          setSearchStatus('');
        }, 1000);
        
      } catch (err) {
        console.error('Error loading semantic search model:', err);
        setError('Failed to initialize semantic search.');
        setIsModelLoading(false);
        setSearchStatus('');
      }
    };
    
    loadModelAndEmbed();
  }, [researchTopics]);

  const handleSemanticSearch = async () => {
    if (!model || !semanticQuery || !embeddings) return;

    setIsSearching(true);
    setSearchStatus('Analyzing your query...');
    setError(null);

    try {
      const queryEmbedding = await model.embed([semanticQuery]);
      setSearchStatus('Computing similarities...');
      
      const scores = await computeSimilarities(queryEmbedding, embeddings);
      
      // Get top matching topics (with threshold for relevance)
      const threshold = 0.3; // Adjust this threshold as needed
      const topMatches = scores
        .map((score: number, i: number) => ({ topic: researchTopics[i], score }))
        .filter(result => result.score > threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // top 10 matches
        .map(result => result.topic);

      setSemanticResults(topMatches);
      setSearchStatus(`Found ${topMatches.length} matching research areas.`);
      
      setTimeout(() => setSearchStatus(''), 3000);
      
    } catch (err) {
      console.error('Semantic search error:', err);
      setError('Semantic search failed. Please try again.');
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
      
      if (queryNorm === 0 || topicNorm === 0 || !isFinite(dot) || !isFinite(queryNorm) || !isFinite(topicNorm)) {
        return 0;
      }
      
      const similarity = dot / (queryNorm * topicNorm);
      return isFinite(similarity) ? Math.max(0, Math.min(1, similarity)) : 0;
    });
  };

  const filtered = useMemo(() => {
    let filtered = results;

    // Filter by semantic search results
    if (semanticResults.length > 0) {
      filtered = filtered.filter((profile: Profile) =>
        profile.research?.some((research) => 
          semanticResults.some(semanticTopic => 
            research.name.toLowerCase().includes(semanticTopic.toLowerCase()) ||
            semanticTopic.toLowerCase().includes(research.name.toLowerCase())
          )
        )
      );
    }
  
    // Filter by units
    if (Array.isArray(units) && units.length > 0) {
      filtered = filtered.filter((profile: Profile) =>
        profile.units?.some((unit: Unit) => selectedUnits.includes(unit.id))
      );
    }

    return filtered;
  }, [results, semanticResults, selectedUnits, units]);

  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  return (
    <div className="bg-grey-light-bg border-t-4 border-yellow w-full -m-1">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {searchStatus}
      </div>

      {/* Loading Progress Bar for Semantic Search */}
      {isModelLoading && (
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 transition-all duration-1000 ease-out w-full animate-pulse" />
        </div>
      )}

      <Container className={twMerge("flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end", className)}>      

        <div className="md:w-1/3">
          <TextInput
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Start typing to search"
          >
            <span className="text-l font-bold mb-1">Search by First or Last Name</span>
          </TextInput>
        </div>
        
        {units?.length > 0 && (
          <div className="md:w-1/3">
            <Field>
              <Label className="text-body-copy-bold font-bold">Filter by college, department, or unit</Label>
              <Select
                multiple
                as="div"
                onChange={(value) => {
                  // Handle the case where value might be a string, array, or other type
                  const selectedIds = Array.isArray(value) ? value : [];
                  setSelectedUnits(selectedIds.length > 0 ? selectedIds : units?.map(unit => unit.id) ?? []);
                }}
              >
                <SelectButton>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis w-fit">
                    {units?.filter(unit => selectedUnits.includes(unit.id)).map(unit => unit.name).join(", ")}
                  </span>
                </SelectButton>
                <SelectOptions>
                  {units.map((unit) => (
                    <SelectOption value={unit.id} key={unit.id}>
                      {unit.name}
                    </SelectOption>
                  ))}
                </SelectOptions>
              </Select>
            </Field>
          </div>
        )}
        
        <div className="flex flex-row items-center self-start mt-9">
          <Checkbox />
          <span className="ps-3 text-body-copy-bold font-bold"> Accepting new graduate students</span>          
        </div>
      </Container>
      <Container className="pb-8">
        {/* Status Messages */}
        {(isModelLoading || isSearching || error) && (
          <div className="w-full mb-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            {(isModelLoading || isSearching) && !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <div className="flex-shrink-0">
                  <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-blue-800 text-sm font-medium">{searchStatus}</p>
              </div>
            )}
          </div>
        )}
      {/* Semantic Search by Research Topic */}
        {researchTopics.length > 0 && (
          <div className="w-full">
            <Field>
              <Label className="text-body-copy-bold font-bold">Search by Research Area</Label>
              <div className="flex gap-2">
                <div className="sm:w-full md:w-3/4">
                  <TextInput
                    value={semanticQuery}
                    placeholder="Enter research topic or keyword..."
                    disabled={!model || isModelLoading}
                    onInput={(e) => setSemanticQuery((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSemanticSearch();
                      }
                    }}
                  />
                </div>
                <div className="sm:w-full md:w-1/4">
                  <button
                    type="button"
                    onClick={handleSemanticSearch}
                    disabled={!model || !semanticQuery || isSearching || isModelLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
                  >
                  {isSearching && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span>
                    {isSearching ? 'Searching...' : isModelLoading ? 'Loading...' : !model ? 'Initializing...' : 'AI-powered Search'}
                  </span>
                </button>
                </div>
              </div>
              {/* Display semantic search results */}
              {semanticResults.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">AI found {semanticResults.length} matching areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {semanticResults.slice(0, 10).map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {topic}
                        <button
                          type="button"
                          className="ml-2 text-green-600 hover:text-green-800"
                          onClick={() => {
                            setSemanticResults(semanticResults.filter(t => t !== topic));
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {semanticResults.length > 10 && (
                      <span className="text-sm text-gray-500 px-3 py-1">
                        +{semanticResults.length - 10} more
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSemanticResults([])}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    Clear semantic search
                  </button>
                </div>
              )}
            </Field>
          </div>
        )}
      </Container>
    </div>
  );
};
