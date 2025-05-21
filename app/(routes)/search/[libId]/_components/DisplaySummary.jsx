import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react'

const DisplaySummary = ({ aiResp }) => {
  return (
    <div className="max-w-4xl mx-auto font-sans mt-7">
      {!aiResp && <div>
        <div className='w-full h-5 mt-2 bg-accent animate-pulse rounded-md'></div>
        <div className='w-1/2 h-5 mt-2 bg-accent animate-pulse rounded-md'></div>
        <div className='w-[70%] h-5 mt-2 bg-accent animate-pulse rounded-md'></div>

        </div>}
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 
              className="text-4xl font-bold text-gray-800 mb-5 mt-6 pb-2 border-b border-gray-200 leading-tight"
              {...props} 
            />
          ),

          h2: ({ node, ...props }) => (
            <h2 
              className="text-3xl font-semibold text-gray-700 mb-4 mt-6 leading-tight"
              {...props} 
            />
          ),

          h3: ({ node, ...props }) => (
            <h3 
              className="text-2xl font-semibold text-gray-700 mt-5 mb-3 leading-tight"
              {...props} 
            />
          ),

          p: ({ node, ...props }) => (
            <p 
              className="text-gray-700 leading-relaxed mb-4 text-lg"
              {...props} 
            />
          ),

          a: ({ node, ...props }) => (
            <a
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-1"
              target="_blank"
              rel="noreferrer"
              {...props}
            >
              {props.children}
              <ExternalLink className="h-3 w-3" />
            </a>
          ),

          ul: ({ node, ...props }) => (
            <ul 
              className="list-none space-y-1 leading-relaxed mb-4 pl-4"
              {...props} 
            />
          ),

          ol: ({ node, ...props }) => (
            <ol 
              className="list-decimal space-y-1 leading-relaxed mb-4 pl-6"
              {...props} 
            />
          ),

          li: ({ node, ...props }) => (
            <li 
              className="mb-1 flex items-start"
              {...props}
            >
              <span className="inline-block text-blue-500 mr-2 mt-1">•</span>
              <span>{props.children}</span>
            </li>
          ),

          blockquote: ({ node, ...props }) => (
            <div className="mb-4">
              <blockquote 
                className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded-r-md text-gray-600 leading-relaxed italic"
                {...props} 
              />
            </div>
          ),

          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table 
                className="min-w-full text-base text-gray-700 border-collapse bg-white shadow-sm rounded-md"
                {...props} 
              />
            </div>
          ),

          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50" {...props} />
          ),

          th: ({ node, ...props }) => (
            <th 
              className="border-b border-gray-200 px-4 py-2 text-left font-semibold text-gray-700"
              {...props} 
            />
          ),

          td: ({ node, ...props }) => (
            <td 
              className="border-b border-gray-100 px-4 py-3"
              {...props} 
            />
          ),

          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="mb-4">
                <div className="bg-gray-700 rounded-t-md px-3 py-1 text-gray-200 text-sm font-mono flex justify-between items-center">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-b-md overflow-auto"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded-md font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },

          hr: () => (
            <hr className="my-6 h-px bg-gray-200 border-0" />
          ),

          div: ({ node, ...props }) => {
            if (props.className === 'tip') {
              return (
                <div className="flex bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3 mt-1" />
                  <div className="text-green-800">{props.children}</div>
                </div>
              );
            } else if (props.className === 'warning') {
              return (
                <div className="flex bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-3 mt-1" />
                  <div className="text-amber-800">{props.children}</div>
                </div>
              );
            } else if (props.className === 'info') {
              return (
                <div className="flex bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-4">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mr-3 mt-1" />
                  <div className="text-blue-800">{props.children}</div>
                </div>
              );
            }
            return <div {...props} />;
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
};

export default DisplaySummary;