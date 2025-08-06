import React, { useState } from "react";
import newRequest from "../utils/newRequest"; 
import { useNavigate } from "react-router-dom";
import upload from "../utils/upload"; 

const AddGig = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

 
  const [gigData, setGigData] = useState({
    title: "",
    shortTitle: "",
    desc: "",
    shortDesc: "",
    cat: "",
    price: "",
    cover: "",
    images: [],
    deliveryTime: "",
    revisionNumber: "",
    features: ["", "", ""], // Start with 3 feature inputs
  });

  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGigData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFeature = (index, value) => {
    const updated = [...gigData.features];
    updated[index] = value;
    setGigData({ ...gigData, features: updated });
  };

  const addFeature = () => {
    setGigData({ ...gigData, features: [...gigData.features, ""] });
  };

  const removeFeature = (indexToRemove) => {
    setGigData({
      ...gigData,
      features: gigData.features.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleCoverUpload = async () => {
    if (coverFile) {
      return await upload(coverFile);
    }
    return "";
  };

  const handleImagesUpload = async () => {
    const urls = await Promise.all(
      imageFiles.map(async (file) => await upload(file))
    );
    return urls.filter(Boolean); // remove nulls
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const coverUrl = await handleCoverUpload();
      const imageUrls = await handleImagesUpload();

      const payload = {
        ...gigData,
        userId: currentUser?._id,
        price: Number(gigData.price),
        deliveryTime: Number(gigData.deliveryTime),
        revisionNumber: Number(gigData.revisionNumber),
        cover: coverUrl,
        images: imageUrls,
        features: gigData.features.filter(f => f.trim() !== "") // Remove empty features on submit
      };

      await newRequest.post("/gigs/creategig", payload);
      navigate("/mygigs");

    } catch (err) {
      console.error("Failed to create gig:", err);
      setError(err.response?.data?.message || "Failed to create the service. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Service</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Full Title</label>
                <input type="text" id="title" name="title" value={gigData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g. I will design a modern minimalist logo" required />
              </div>

              <div>
                <label htmlFor="shortTitle" className="block text-sm font-medium text-gray-700 mb-1">Short Title</label>
                <input type="text" id="shortTitle" name="shortTitle" value={gigData.shortTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g. Modern Logo Design" maxLength="60" required />
                <p className="text-xs text-gray-500 mt-1">Maximum 60 characters</p>
              </div>

              <div>
                <label htmlFor="cat" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <select id="cat" name="cat" value={gigData.cat} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" required>
                    <option value="">Select a category</option>
                    <option value="design">Design</option>
                    <option value="web-development">Web Development</option>
                    <option value="writing">Content Writing</option>
                    <option value="ai-services">AI Services</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="video-animation">Video & Animation</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" id="price" name="price" value={gigData.price} onChange={handleChange} min="5" step="1" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Enter your service price" required />
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days)</label>
                <input type="number" id="deliveryTime" name="deliveryTime" value={gigData.deliveryTime} onChange={handleChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g. 3" required />
              </div>

              <div>
                <label htmlFor="revisionNumber" className="block text-sm font-medium text-gray-700 mb-1">Number of Revisions</label>
                <input type="number" id="revisionNumber" name="revisionNumber" value={gigData.revisionNumber} onChange={handleChange} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g. 2" required />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input type="text" id="shortDesc" name="shortDesc" value={gigData.shortDesc} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Brief, catchy description of your service" maxLength="120" required/>
              <p className="text-xs text-gray-500 mt-1">Maximum 120 characters</p>
            </div>

            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea id="desc" name="desc" value={gigData.desc} onChange={handleChange} rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Detailed description of your service and what you offer" required></textarea>
            </div>
          </div>

          {/* Service Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Features</label>
            <div className="space-y-3">
              {gigData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={feature} onChange={(e) => updateFeature(index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder={`Feature ${index + 1} (e.g. Source file included)`} />
                  <button type="button" onClick={() => removeFeature(index)} className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add Feature
              </button>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <label htmlFor="cover-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                {coverFile ? (
                  <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="h-32 w-auto object-cover rounded-md"/>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-sm text-gray-500 mb-1">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG or GIF (Max. 5MB)</p>
                  </>
                )}
              </label>
              <input type="file" id="cover-upload" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="hidden" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageFiles.map((file, index) => (
                    <div key={index} className="relative h-40">
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg"/>
                    </div>
                ))}
                {imageFiles.length < 4 && (
                    <label htmlFor="images-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-xs text-gray-500 text-center">Add image</p>
                    </label>
                )}
              </div>
              <input type="file" id="images-upload" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files).slice(0, 4))} className="hidden"/>
              <p className="text-xs text-gray-500 mt-2">You can add up to 4 additional images.</p>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 10-2 0v2a1 1 0 102 0v-2zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
                <div className="ml-3"><p className="text-sm font-medium text-red-800">{error}</p></div>
              </div>
            </div>}
            
          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button type="button" className="px-4 py-2 mr-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
              Save as Draft
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all flex items-center">
              {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isLoading ? 'Publishing...' : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGig;