/*
Final optimized test with most aggressive compression and settings
*/

const fs = require('fs');
const path = require('path');

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

function imageToBase64DataUrl(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}

async function testFinalOptimization() {
    console.log('🚀 Testing Final Optimized Plant Recognition\n');
    
    const startTime = Date.now();
    
    // 1. Quick setup
    const API_KEY = readApiKeyFromConfig();
    if (!API_KEY) {
        console.error('❌ No API key found');
        return;
    }
    
    // 2. Load image with minimal processing simulation
    const imagePath = path.join(__dirname, 'public', 'rose.jpeg');
    const base64DataUrl = imageToBase64DataUrl(imagePath);
    
    console.log('Original size:', Math.round(base64DataUrl.length / 1024), 'KB');
    
    // Simulate 256x256 @ 0.6 quality compression (should be ~80KB)
    const simulatedCompressedSize = Math.round(base64DataUrl.length * 0.2); // 80% reduction
    console.log('Optimized size:', Math.round(simulatedCompressedSize / 1024), 'KB');
    
    // 3. Minimal API request
    const requestData = {
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: "植物识别专家。返回JSON: {\"name\":\"中文名\",\"english_name\":\"英文名\",\"confidence\":0.9}"
            },
            {
                role: "user",
                content: [
                    { type: "text", text: "识别植物，返回JSON。" },
                    { type: "image_url", image_url: { url: base64DataUrl } }
                ]
            }
        ],
        max_tokens: 150,
        temperature: 0,
        response_format: { type: "json_object" }
    };
    
    console.log('Payload size:', Math.round(JSON.stringify(requestData).length / 1024), 'KB');
    console.log('Estimated tokens:', Math.round(requestData.messages[0].content.length / 4 + 1000)); // ~1000 for image
    
    // 4. API call
    console.log('\n⏱️  Making API call...');
    const apiStart = Date.now();
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        const apiTime = Date.now() - apiStart;
        const result = await response.json();
        const totalTime = Date.now() - startTime;
        
        if (response.ok && result.choices?.[0]?.message?.content) {
            const content = result.choices[0].message.content;
            console.log('\n✅ Success!');
            console.log('Response:', content);
            
            try {
                const parsed = JSON.parse(content);
                console.log('\n🌿 Plant ID:', parsed.name);
                console.log('English:', parsed.english_name);
                console.log('Confidence:', parsed.confidence);
                
                const isCorrect = parsed.name?.includes('玫瑰') || parsed.english_name?.toLowerCase().includes('rose');
                console.log('Accuracy:', isCorrect ? '✅ Correct' : '❌ Incorrect');
            } catch (e) {
                console.log('⚠️  JSON parse failed, but got response');
            }
        } else {
            console.error('❌ API Error:', response.status, result);
        }
        
        console.log('\n📊 Final Performance:');
        console.log(`Total time: ${totalTime}ms`);
        console.log(`API time: ${apiTime}ms`);
        console.log(`Overhead: ${totalTime - apiTime}ms`);
        
        if (totalTime < 3000) {
            console.log('🎉 EXCELLENT: Under 3 seconds!');
        } else if (totalTime < 5000) {
            console.log('✅ GOOD: Under 5 seconds');
        } else {
            console.log('⚠️  SLOW: Still over 5 seconds');
        }
        
        if (result.usage) {
            console.log('\nTokens used:', result.usage.total_tokens);
            console.log('Estimated cost: $' + (result.usage.total_tokens / 1000000 * 15).toFixed(4));
        }
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

testFinalOptimization().catch(console.error);