import { useState } from 'react';
import { simpleAI } from '@/service/SimpleAIModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleAIDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testBasicQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const answer = await simpleAI.ask('What are the top 3 tourist attractions in Paris?');
      setResult({ type: 'text', data: answer });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testTravelPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await simpleAI.generateTravelPlan('Tokyo', 3);
      setResult({ type: 'json', data: plan });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCityInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const insights = await simpleAI.getCityInsights('Barcelona');
      setResult({ type: 'json', data: insights });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const budget = await simpleAI.predictBudget('Bali', 7, 'moderate');
      setResult({ type: 'json', data: budget });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = () => {
    const status = simpleAI.getStatus();
    setResult({ type: 'status', data: status });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🤖 Simple AI Model Demo</CardTitle>
          <CardDescription>
            Test your Vertex AI integration with simple examples
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button onClick={checkStatus} variant="outline">
              Check Status
            </Button>
            <Button onClick={testBasicQuestion} disabled={loading}>
              Ask Question
            </Button>
            <Button onClick={testTravelPlan} disabled={loading}>
              Travel Plan
            </Button>
            <Button onClick={testCityInsights} disabled={loading}>
              City Insights
            </Button>
            <Button onClick={testBudget} disabled={loading}>
              Budget Estimate
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300">
                🔄 Generating response...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-semibold">
                ❌ Error:
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            </div>
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
                ✅ Result:
              </p>
              
              {result.type === 'text' && (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {result.data}
                </p>
              )}

              {result.type === 'json' && (
                <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}

              {result.type === 'status' && (
                <div className="space-y-2">
                  {Object.entries(result.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className={value === '✓ Set' || value === true ? 'text-green-600' : ''}>
                        {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Usage Examples */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">📝 Usage Examples:</h3>
            <pre className="text-xs overflow-x-auto">
{`// Import the model
import { simpleAI } from '@/service/SimpleAIModel';

// Ask a simple question
const answer = await simpleAI.ask('What is the capital of France?');

// Get JSON response
const data = await simpleAI.askJSON('List 3 cities in JSON format');

// Generate travel plan
const plan = await simpleAI.generateTravelPlan('Paris', 5);

// Get city insights
const insights = await simpleAI.getCityInsights('London');

// Predict budget
const budget = await simpleAI.predictBudget('Dubai', 7, 'luxury');`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
