import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import BusinessSuites from '../pages/BusinessSuites';
import FacebookAccounts from '../pages/FacebookAccounts';
import PostSelection from '../pages/PostSelection';
import Analysis from '../pages/Analysis';

const InstagramAnalyzer: React.FC = () => {
  const navigate = useNavigate();

  // URL params for Facebook OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // State management
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  
  // Business Suites
  const [suiteLabels, setSuiteLabels] = useState<string[]>([]);
  const [suiteIds, setSuiteIds] = useState<string[]>([]);
  const [selectedSuiteIndex, setSelectedSuiteIndex] = useState<number>(-1);
  
  // Facebook Accounts
  const [fbAccounts, setFbAccounts] = useState<string[]>([]);
  const [fbAccountIds, setFbAccountIds] = useState<string[]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(-1);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  
  // Posts
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [videoArray, setVideoArray] = useState<string[]>([]);
  const [commentJSON, setCommentJSON] = useState<Record<string, any>>({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Analysis
  const [analysisData, setAnalysisData] = useState<[string[], number, string] | null>(null);

  // Facebook Login
  const handleFacebookLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const appId = '803246971960239';
    const redirectUri = window.location.origin + window.location.pathname;
    const authUrl = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,pages_show_list,business_management,pages_read_engagement`;
    window.location.href = authUrl;
  };

  // Fetch initial data after login
  const fetchInitialData = async () => {
    try {
      const response = await fetch(`https://graph.facebook.com/v11.0/oauth/access_token?client_id=803246971960239&redirect_uri=${window.location.origin + window.location.pathname}&client_secret=c19298b4ce75926bf2dc0177b77e5912&code=${code}`);
      const data = await response.json();
      const token = data["access_token"];
      setAccessToken(token);

      const businessResponse = await fetch(`https://graph.facebook.com/v20.0/me/businesses?access_token=${token}`);
      const businessData = await businessResponse.json();
      const businesses = businessData["data"];

      if (businesses.length === 0) {
        throw new Error("This Meta login has no associated Meta Business Suites");
      }

      const labels = businesses.map((b: any) => b.name);
      const ids = businesses.map((b: any) => b.id);
      
      setSuiteLabels(labels);
      setSuiteIds(ids);
      setLoggedIn(true);
      navigate('/business-suites');
    } catch (error) {
      console.error('Error fetching initial data:', error);
      alert(error);
    }
  };

  // Handle suite selection
  const handleSuiteSelection = async (index: number) => {
    setSelectedSuiteIndex(index);
    setLoadingAccounts(true);
    
    try {
      const response = await fetch(`https://graph.facebook.com/v14.0/${suiteIds[index]}/owned_pages?access_token=${accessToken}`);
      const data = await response.json();
      const accounts = data["data"];

      if (accounts.length === 0) {
        throw new Error("This Meta Business Suite has no associated Facebook Business Accounts");
      }

      const accountNames = accounts.map((acc: any) => acc.name);
      const accountIds = accounts.map((acc: any) => acc.id);
      
      setFbAccounts(accountNames);
      setFbAccountIds(accountIds);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      alert(error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Handle account selection
  const handleAccountSelection = async (index: number) => {
    setSelectedAccountIndex(index);
    setLoadingPosts(true);
    
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/${fbAccountIds[index]}?fields=instagram_business_account&access_token=${accessToken}`);
      const data = await response.json();
      const igId = data["instagram_business_account"]["id"];
      
      const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${igId}/media?access_token=${accessToken}`);
      const postsData = await postsResponse.json();
      const posts = postsData["data"];
      
      if (posts.length === 0) {
        throw new Error("This Instagram business Account has no Posts");
      }

      const images: string[] = [];
      const videos: string[] = [];
      const comments: Record<string, any> = {};
      
      // Fetch details for each post
      const postPromises = posts.map(async (post: any) => {
        const detailResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}?fields=media_url,timestamp,like_count,comments,media_type&access_token=${accessToken}`);
        const detailData = await detailResponse.json();
        
        comments[detailData.media_url] = [detailData.comments, detailData.like_count, detailData.timestamp];
        
        if (detailData.media_type === 'IMAGE') {
          images.push(detailData.media_url);
        } else {
          videos.push(detailData.media_url);
        }
      });
      
      await Promise.all(postPromises);
      
      setImageArray(images);
      setVideoArray(videos);
      setCommentJSON(comments);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert(error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Handle post selection for analysis
  const handlePostSelection = (url: string, comments: Record<string, any>) => {
    const postData = comments[url];
    const commentTexts = postData[0]?.data?.map((c: any) => c.text) || [];
    setAnalysisData([commentTexts, postData[1], postData[2]]);
  };

  // Reset functions for navigation
  const resetToSuites = () => {
    setFbAccounts([]);
    setFbAccountIds([]);
    setSelectedSuiteIndex(-1);
    setImageArray([]);
    setVideoArray([]);
    setCommentJSON({});
    setAnalysisData(null);
  };

  const resetToAccounts = () => {
    setSelectedAccountIndex(-1);
    setImageArray([]);
    setVideoArray([]);
    setCommentJSON({});
    setAnalysisData(null);
  };

  const resetToPosts = () => {
    setAnalysisData(null);
  };

  // Effect to handle OAuth callback
  useEffect(() => {
    if (code && !loggedIn) {
      fetchInitialData();
    }
  }, [code, loggedIn]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          !loggedIn ? (
            <Login onLogin={handleFacebookLogin} />
          ) : (
            <BusinessSuites 
              suites={suiteLabels}
              suiteIds={suiteIds}
              onSelectSuite={handleSuiteSelection}
            />
          )
        } 
      />
      <Route 
        path="/business-suites" 
        element={
          <BusinessSuites 
            suites={suiteLabels}
            suiteIds={suiteIds}
            onSelectSuite={handleSuiteSelection}
          />
        } 
      />
      <Route 
        path="/facebook-accounts" 
        element={
          <FacebookAccounts 
            accounts={fbAccounts}
            accountIds={fbAccountIds}
            loading={loadingAccounts}
            onSelectAccount={handleAccountSelection}
            onBack={resetToSuites}
          />
        } 
      />
      <Route 
        path="/post-selection" 
        element={
          <PostSelection 
            imageArray={imageArray}
            videoArray={videoArray}
            commentJSON={commentJSON}
            loading={loadingPosts}
            onSelectPost={handlePostSelection}
            onBack={resetToAccounts}
          />
        } 
      />
      <Route 
        path="/analysis" 
        element={
          analysisData ? (
            <Analysis 
              commentArr={analysisData}
              onBack={resetToPosts}
            />
          ) : (
            <div>No analysis data available</div>
          )
        } 
      />
    </Routes>
  );
};

export default InstagramAnalyzer;