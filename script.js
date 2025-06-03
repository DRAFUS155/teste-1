// TODO: Replace with your actual DeepAI API key
const DEEP_AI_API_KEY = '84171b78-ec5b-434d-b315-d8260544fdf4';

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
            imageContainer.innerHTML = `<img src="${imageUrl}" alt="${altText}">`;
        } else if (message) {
            imageContainer.innerHTML = `<span>${message}</span>`;
        } else {
            // Default fallback if no specific state is set (e.g. after an error without a custom message)
            imageContainer.innerHTML = '<span>Não foi possível exibir a imagem ou nenhuma imagem selecionada.</span>';
        }
    }

    // Set initial message in the image container
    // The default HTML already has "Nenhuma imagem gerada ainda." which is fine.
    // If we wanted JS to control it: displayInImageContainer({ message: "Nenhuma imagem gerada ainda." });


    // Event listener for the 'Gerar Imagem' button
    if (generateImageButton) {
        generateImageButton.addEventListener('click', async () => {
            if (DEEP_AI_API_KEY === 'YOUR_API_KEY_HERE') {
                alert('Por favor, configure sua chave de API DeepAI em script.js');
                return;
            }

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
                    promptText += ` Personagem falando: "${dialogo}"`;
                }
                if (pensamento) {
                    promptText += ` Pensamento do personagem: "${pensamento}"`;
                }
                promptText += ", desenho detalhado, alta qualidade";

                const apiUrl = 'https://api.deepai.org/api/text2img';
                const headers = {
                    'api-key': DEEP_AI_API_KEY,
                    'Content-Type': 'application/json'
                };
                let bodyParams = {
                    text: promptText,
                    grid_size: "1", // Ensure a single image output
                };

                if (estilo === "Gamon Sakurai") {
                    bodyParams.image_generator_version = "genius";
                    bodyParams.genius_preference = "anime";
                    bodyParams.text += ", no estilo mangá de Gamon Sakurai";
                } else if (estilo === "Fotorrealista") { // Updated to match Portuguese value in HTML
                    bodyParams.image_generator_version = "genius";
                    bodyParams.genius_preference = "photography";
                    bodyParams.text += ", fotorealista";
                }

                console.log("Enviando para DeepAI. Prompt:", bodyParams.text);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(bodyParams)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Erro da API DeepAI:", response.status, errorText);
                    throw new Error(`Erro da API (${response.status}): ${errorText}`);
                }

                const data = await response.json();
                console.log("Resposta da API DeepAI:", data);

                if (data.output_url) {
                    displayInImageContainer({ imageUrl: data.output_url, altText: "Imagem Gerada pela API" });
                } else {
                    console.error("`output_url` não encontrado na resposta da API.", data);
                    displayInImageContainer({ message: "Erro ao gerar imagem: `output_url` não foi retornado." });
                    alert("Erro ao gerar imagem: `output_url` não encontrado na resposta da API. Verifique o console para detalhes.");
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
});
