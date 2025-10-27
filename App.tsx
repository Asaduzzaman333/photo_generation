
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { OptionSelector } from './components/OptionSelector';
import { generateTryOnImage } from './services/geminiService';
import { BACKGROUND_OPTIONS } from './constants';
import type { BackgroundOption } from './types';
import { MagicWandIcon, DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [dressImage, setDressImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(BACKGROUND_OPTIONS[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!modelImage || !dressImage) {
      setError('Please upload both a model and a dress image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateTryOnImage(modelImage, dressImage, selectedBackground.prompt);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, dressImage, selectedBackground]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-slate-900 text-white animate-gradient-xy">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 pb-2">
            AI Virtual Try-On
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mt-2">
            Dress your model in any outfit, instantly. Upload your images, select a background, and let our AI create the perfect look.
          </p>
        </header>

        <main className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader title="Upload Model" onImageUpload={setModelImage} />
            <ImageUploader title="Upload Dress" onImageUpload={setDressImage} />
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
            <OptionSelector
              title="Choose a Background"
              options={BACKGROUND_OPTIONS}
              selectedOption={selectedBackground}
              onSelect={setSelectedBackground}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleGenerate}
              disabled={!modelImage || !dressImage || isLoading}
              className="flex items-center gap-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <MagicWandIcon />
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {error && (
            <div className="mt-8 text-center bg-red-500/20 text-red-300 p-4 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          <div className="mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 min-h-[400px]">
                <div className="w-16 h-16 border-4 border-t-purple-400 border-gray-600 rounded-full animate-spin"></div>
                <p className="text-gray-300 text-lg">Our AI stylist is working its magic...</p>
              </div>
            )}
            {generatedImage && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl transition-opacity duration-500 ease-in-out animate-[fadeIn_1s]">
                <h2 className="text-2xl font-bold text-center mb-6">Your Creation</h2>
                <img src={generatedImage} alt="Generated try-on" className="w-full max-w-lg mx-auto rounded-lg shadow-2xl" />
                <div className="text-center mt-6">
                  <a
                    href={generatedImage}
                    download="ai-virtual-try-on.png"
                    className="inline-flex items-center gap-3 text-md font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 px-8 py-3 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out"
                  >
                    <DownloadIcon />
                    Download Image
                  </a>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
