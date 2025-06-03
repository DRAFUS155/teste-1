// Usando Pollinations.ai - API gratuita sem necessidade de chave
// Alternativa: Hugging Face Inference API (também gratuita)

document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const dialogueTextElement = document.getElementById('dialogueText');
    const thoughtTextElement = document.getElementById('thoughtText');
    const scenarioDescriptionElement = document.getElementById('scenarioDescription');
    const characterAppearanceElement = document.getElementById('characterAppearance');
    const artStyleElement = document.getElementById('artStyle');
    const generateImageButton = document.getElementById('generateImageButton');
    const imageContainer = document.getElementById('imageContainer');
    const uploadImageElement = document.getElementById('uploadImage');

    // Function to display image, loading, or message in the image container
    function displayInImageContainer(options = {}) {
        const { imageUrl, isLoading = false, message = '', altText = 'Imagem Exibida' } = options;

        if (!imageContainer) {
            console.error("Element with ID 'imageContainer' not found.");
            return;
        }

        if (isLoading) {
            imageContainer.innerHTML = '<span>Gerando imagem, por favor aguarde...</span>';
        } else if (imageUrl) {
            imageContainer.innerHTML = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;">`;
        } else if (message) {
            imageContainer.innerHTML = `<span>${message}</span>`;
        } else {
            imageContainer.innerHTML = '<span>Não foi possível exibir a imagem ou nenhuma imagem selecionada.</span>';
        }
    }

    // Função para gerar imagem usando Pollinations.ai (gratuita)
    async function generateImageWithPollinations(prompt) {
        try {
            // Pollinations.ai permite gerar imagens via URL simples
            const encodedPrompt = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
            
            // Verificar se a imagem foi gerada corretamente
            const response = await fetch(imageUrl);
            if (response.ok) {
                return imageUrl;
            } else {
                throw new Error('Erro ao gerar imagem com Pollinations');
            }
        } catch (error) {
            console.error('Erro Pollinations:', error);
            return null;
        }
    }

    // Função alternativa usando Hugging Face (gratuita, mas com rate limit)
    async function generateImageWithHuggingFace(prompt) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            negative_prompt: "blurry, low quality, distorted",
                            num_inference_steps: 20,
                            guidance_scale: 7.5
                        }
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro Hugging Face:', error);
            return null;
        }
    }

    // Event listener for the 'Gerar Imagem' button
    if (generateImageButton) {
        generateImageButton.addEventListener('click', async () => {
            generateImageButton.disabled = true;
            displayInImageContainer({ isLoading: true });

            try {
                const dialogo = dialogueTextElement ? dialogueTextElement.value.trim() : '';
                const pensamento = thoughtTextElement ? thoughtTextElement.value.trim() : '';
                const cenario = scenarioDescriptionElement ? scenarioDescriptionElement.value.trim() : '';
                const personagem = characterAppearanceElement ? characterAppearanceElement.value.trim() : '';
                const estilo = artStyleElement ? artStyleElement.value : '';

                let promptText = cenario;
                if (personagem) {
                    promptText += ` ${personagem}`;
                }
                if (dialogo) {
                    promptText += ` Character speaking: "${dialogo}"`;
                }
                if (pensamento) {
                    promptText += ` Character thinking: "${pensamento}"`;
                }

                // Adicionar estilo baseado na seleção
                if (estilo === "Gamon Sakurai") {
                    promptText += ", manga style, anime art, detailed drawing, black and white manga";
                } else if (estilo === "Fotorrealista") {
                    promptText += ", photorealistic, detailed, high quality, realistic";
                } else {
                    promptText += ", detailed artwork, high quality";
                }

                console.log("Gerando imagem com prompt:", promptText);

                // Tentar primeiro com Pollinations (mais confiável)
                let imageUrl = await generateImageWithPollinations(promptText);
                
                // Se falhar, tentar com Hugging Face
                if (!imageUrl) {
                    console.log("Tentando com Hugging Face...");
                    imageUrl = await generateImageWithHuggingFace(promptText);
                }

                if (imageUrl) {
                    displayInImageContainer({ imageUrl: imageUrl, altText: "Imagem Gerada pela API" });
                } else {
                    displayInImageContainer({ message: "Erro ao gerar imagem. Tente novamente em alguns minutos." });
                    alert("Não foi possível gerar a imagem. As APIs gratuitas podem ter limitações. Tente novamente.");
                }

            } catch (error) {
                console.error("Erro ao gerar imagem:", error);
                displayInImageContainer({ message: `Ocorreu um erro: ${error.message}` });
                alert(`Ocorreu um erro ao gerar a imagem: ${error.message}`);
            } finally {
                generateImageButton.disabled = false;
            }
        });
    } else {
        console.error("Element with ID 'generateImageButton' not found.");
    }

    // Event listener for the file input
    if (uploadImageElement) {
        uploadImageElement.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    displayInImageContainer({ imageUrl: e.target.result, altText: "Imagem Carregada pelo Usuário" });
                }
                reader.onerror = (error) => {
                    console.error("Erro ao ler arquivo:", error);
                    displayInImageContainer({ message: "Erro ao carregar imagem local."});
                    alert("Não foi possível carregar a imagem selecionada.");
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error("Element with ID 'uploadImage' not found.");
    }

    // Função para testar conectividade das APIs
    async function testAPIs() {
        console.log("Testando APIs disponíveis...");
        
        // Teste simples do Pollinations
        try {
            const testUrl = "https://image.pollinations.ai/prompt/test?width=100&height=100";
            const response = await fetch(testUrl);
            if (response.ok) {
                console.log("✅ Pollinations.ai está funcionando");
            }
        } catch (error) {
            console.log("❌ Pollinations.ai não está disponível");
        }
    }

    // Testar APIs na inicialização
    testAPIs();
});
