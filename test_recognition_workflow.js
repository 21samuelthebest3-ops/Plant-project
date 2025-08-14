/*
Test script to debug plant recognition workflow with rose.jpeg
This script simulates the exact browser workflow to identify latency and accuracy issues
*/

const fs = require('fs');
const path = require('path');

// Read config.js to get API key
function readApiKeyFromConfig() {
    try {
        const configPath = path.join(__dirname, 'config.js');
        const raw = fs.readFileSync(configPath, 'utf8');
        const match = raw.match(/OPENROUTER_API_KEY\s*:\s*"([^"]+)"/);
        if (match && match[1] && !match[1].includes('REPLACE_WITH')) {
            return match[1].trim();
        }
    } catch (e) {
        console.error('Error reading config:', e.message);
    }
    return null;
}

// Convert image file to base64 data URL (simulating browser behavior)
function imageToBase64DataUrl(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}

// Simulate the browser compression function
function simulateCompression(base64DataUrl, maxWidth = 384, maxHeight = 384, quality = 0.7) {
    // In real browser, this would use Canvas API
    // For testing, we'll just return the original with size info
    console.log('🖼️  Original image size:', Math.round(base64DataUrl.length / 1024), 'KB');
    
    // Simulate compression - in real implementation this reduces size significantly
    // For testing, we assume 70% size reduction
    const simulatedCompressed = base64DataUrl; // In browser, this would be smaller
    console.log('📦 Simulated compressed size:', Math.round(simulatedCompressed.length * 0.7 / 1024), 'KB');
    
    return simulatedCompressed;
}

// Test the actual API call with timing
async function testPlantRecognition() {
    console.log('🌹 Testing Plant Recognition with rose.jpeg\n');
    
    const startTime = Date.now();
    
    // 1. Read API key
    console.log('1️⃣  Reading API configuration...');
    const API_KEY = readApiKeyFromConfig();
    if (!API_KEY) {
        console.error('❌ No API key found in config.js');
        return;
    }
    console.log('✅ API key found');
    
    // 2. Load and process image
    console.log('\n2️⃣  Loading and processing image...');
    const imageProcessStart = Date.now();
    
    const imagePath = path.join(__dirname, 'public', 'rose.jpeg');
    if (!fs.existsSync(imagePath)) {
        console.error('❌ rose.jpeg not found at:', imagePath);
        return;
    }
    
    const base64DataUrl = imageToBase64DataUrl(imagePath);
    const compressedImage = simulateCompression(base64DataUrl);
    
    const imageProcessTime = Date.now() - imageProcessStart;
    console.log(`⏱️  Image processing time: ${imageProcessTime}ms`);
    
    // 3. Prepare API request (current optimized version)
    console.log('\n3️⃣  Preparing API request...');
    const requestData = {
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: "你是植物识别专家。分析图片中的植物，直接返回JSON对象，不要用markdown格式或代码块。格式：{\"name\":\"植物中文名\",\"english_name\":\"英文名\",\"type\":\"类型\",\"features\":\"主要特征\",\"care\":\"养护要点\",\"confidence\":0.9}"
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "识别这张植物图片，直接返回JSON对象，不要使用```json```格式。"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: compressedImage
                        }
                    }
                ]
            }
        ],
        max_tokens: 300,
        temperature: 0.1,
        response_format: { type: "json_object" }
    };
    
    console.log('📊 Request payload size:', Math.round(JSON.stringify(requestData).length / 1024), 'KB');
    
    // 4. Make API call with detailed timing
    console.log('\n4️⃣  Making API call...');
    const apiStartTime = Date.now();
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:8080',
                'X-Title': 'Plant Recognition Test'
            },
            body: JSON.stringify(requestData)
        });
        
        const apiCallTime = Date.now() - apiStartTime;
        console.log(`⏱️  API call time: ${apiCallTime}ms`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', response.status, errorText);
            return;
        }
        
        const result = await response.json();
        const totalTime = Date.now() - startTime;
        
        // 5. Process and display results
        console.log('\n5️⃣  Processing results...');
        console.log('✅ API Response received');
        
        if (result.choices && result.choices[0] && result.choices[0].message) {
            const content = result.choices[0].message.content;
            console.log('\n📝 Raw AI Response:');
            console.log(content);
            
            // Try to parse JSON with cleanup
            try {
                // Clean possible markdown code blocks
                let cleanContent = content.trim();
                if (cleanContent.startsWith('```json')) {
                    cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                } else if (cleanContent.startsWith('```')) {
                    cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
                }
                
                const plantInfo = JSON.parse(cleanContent);
                console.log('\n🌿 Parsed Plant Information:');
                console.log('Name:', plantInfo.name || 'Unknown');
                console.log('English:', plantInfo.english_name || 'N/A');
                console.log('Type:', plantInfo.type || 'N/A');
                console.log('Features:', plantInfo.features || 'N/A');
                console.log('Care:', plantInfo.care || 'N/A');
                console.log('Confidence:', plantInfo.confidence || 'N/A');
                
                // Check accuracy for rose
                const isRoseDetected = (plantInfo.name && plantInfo.name.includes('玫瑰')) || 
                                     (plantInfo.english_name && plantInfo.english_name.toLowerCase().includes('rose'));
                console.log('\n🎯 Accuracy Check:', isRoseDetected ? '✅ Correctly identified as rose' : '❌ Failed to identify as rose');
                
            } catch (parseError) {
                console.error('❌ Failed to parse JSON response:', parseError.message);
                console.log('Raw content:', content);
            }
        }
        
        // 6. Performance summary
        console.log('\n📊 Performance Summary:');
        console.log(`Total time: ${totalTime}ms`);
        console.log(`Image processing: ${imageProcessTime}ms (${Math.round(imageProcessTime/totalTime*100)}%)`);
        console.log(`API call: ${apiCallTime}ms (${Math.round(apiCallTime/totalTime*100)}%)`);
        console.log(`Other overhead: ${totalTime - imageProcessTime - apiCallTime}ms`);
        
        if (totalTime > 5000) {
            console.log('\n⚠️  WARNING: Total time > 5 seconds - this is too slow for good UX');
        }
        
        // Token usage
        if (result.usage) {
            console.log('\n💰 Token Usage:');
            console.log(`Prompt tokens: ${result.usage.prompt_tokens}`);
            console.log(`Completion tokens: ${result.usage.completion_tokens}`);
            console.log(`Total tokens: ${result.usage.total_tokens}`);
        }
        
    } catch (error) {
        console.error('❌ Error during API call:', error.message);
        const totalTime = Date.now() - startTime;
        console.log(`Total time before error: ${totalTime}ms`);
    }
}

// Run the test
testPlantRecognition().catch(console.error);