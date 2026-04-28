'use client';
import { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const toneLabels = {
  professional: { label: '💼 Professional', color: 'blue' },
  friendly: { label: '😊 Friendly', color: 'green' },
  enthusiastic: { label: '🎉 Enthusiastic', color: 'purple' }
};

export default function AIResponseGenerator() {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateResponses = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter the review text');
      return;
    }

    setLoading(true);
    setResponses([]);

    try {
      const res = await fetch('/api/ai/review-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText, rating })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgradeRequired) {
          toast.error('Upgrade to Starter plan to use AI responses!');
        } else {
          toast.error(data.error);
        }
        return;
      }

      setResponses(data.responses);
      toast.success('3 AI responses generated! ✨');

    } catch (err) {
      toast.error('Failed to generate responses');
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Response copied!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card card-body">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            AI Review Responder
          </h2>
          <p className="text-sm text-gray-500">
            Generate perfect responses in seconds
          </p>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Star Rating */}
        <div>
          <label className="label">Customer Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={32}
                  className={star <= rating 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-gray-200 fill-gray-200'
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-gray-500 self-center">
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Review Text Input */}
        <div>
          <label className="label">
            Paste the Customer Review
          </label>
          <textarea
            rows={4}
            placeholder="e.g. The food was amazing and the service was fast. Will definitely come back again!"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            className="input resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {reviewText.length} characters
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateResponses}
          disabled={loading || !reviewText.trim()}
          className="btn btn-primary w-full btn-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating 3 responses...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate AI Responses
            </>
          )}
        </button>

        {/* Responses */}
        {responses.length > 0 && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">
                Choose your response:
              </p>
              <button
                onClick={generateResponses}
                className="btn btn-ghost btn-sm text-primary-600"
              >
                <RefreshCw size={14} />
                Regenerate
              </button>
            </div>

            {responses.map((item, index) => {
              const toneInfo = toneLabels[item.tone];
              return (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-2xl p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge badge-${toneInfo.color}`}>
                      {toneInfo.label}
                    </span>
                    <button
                      onClick={() => copyResponse(item.response, index)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        copiedIndex === index
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={14} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.response}
                  </p>
                </div>
              );
            })}

            <div className="alert alert-info text-xs">
              <Sparkles size={14} className="flex-shrink-0" />
              <span>
                Copy and paste this response directly to Google Maps 
                in your Google Business Profile
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}