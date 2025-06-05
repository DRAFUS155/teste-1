# RPG de Texto Interativo com IA

## Descrição

Este projeto visa criar um jogo de RPG de texto (Text-Based RPG) totalmente em português do Brasil, onde os jogadores podem mergulhar em narrativas dinâmicas e influenciar o curso da história com suas decisões. A experiência será enriquecida com mecânicas clássicas de RPG, como sistema de níveis para personagens, combate estratégico inspirado em RPGs de mesa (como D&D ou Pathfinder), e a possibilidade de interação com um mundo rico e responsivo.

Estamos explorando ativamente a integração de Inteligência Artificial (IA) para potencializar a geração de narrativas, tornando cada aventura única, e para criar NPCs (personagens não-jogáveis) com interações mais profundas e realistas.

Além da experiência single-player, um dos objetivos centrais é o desenvolvimento de um modo multiplayer, permitindo que amigos se juntem na mesma aventura, colaborem em desafios e compartilhem a criação de suas histórias.

## Funcionalidades Planejadas (Em Desenvolvimento)

*   **Criação de Personagem Detalhada:** Permita aos jogadores moldar seus avatares com classes, atributos e habilidades diversas.
*   **Narrativa Ramificada:** Decisões que realmente impactam a história e levam a múltiplos finais e arcos narrativos.
*   **Sistema de Combate Tático:** Combate por turnos com base em atributos, perícias e rolagem de dados virtuais.
*   **Progressão de Personagem:** Ganho de experiência, subida de níveis e aquisição de novas habilidades e equipamentos.
*   **Interação com NPCs:** Diálogos complexos e NPCs que reagem às ações e à reputação do jogador.
*   **Mundo Persistente (para multiplayer):** Um mundo que evolui e é compartilhado entre os jogadores.
*   **Integração com IA:**
    *   Geração procedural de missões, descrições e eventos.
    *   NPCs com comportamento e diálogos mais dinâmicos e menos previsíveis.
    *   Um "Mestre de Jogo" (Game Master) virtual que se adapta ao estilo dos jogadores.
*   **Suporte Multiplayer Cooperativo:** Jogue com amigos, compartilhando a mesma jornada.

## Como Contribuir

Este projeto está em fase inicial de desenvolvimento. Se você tem interesse em contribuir, seja com ideias, código, narrativas ou testes, fique de olho nas futuras atualizações sobre como o processo de contribuição será estruturado.

## Tecnologias (Planejadas)

*   Frontend: HTML, CSS, JavaScript (inicialmente, podendo evoluir para frameworks como React/Vue)
*   Backend: Node.js com Express (ou outra tecnologia similar para gerenciar estado do jogo e multiplayer)
*   Banco de Dados: (A definir, dependendo das necessidades de persistência)
*   IA: APIs de modelos de linguagem grandes (LLMs) para geração de texto e interações.

## Considerações sobre API da IA e Custos

Este jogo é projetado para interagir com uma API de Inteligência Artificial externa (como GPT-4 da OpenAI ou similar) para gerar as narrativas e respostas do Mestre de Jogo. A comunicação com esta API deve ser feita através de um **serviço de backend ou proxy seguro**, e não diretamente do frontend.

**Pontos Importantes:**

*   **Proteção da Chave de API (API Key):**
    *   Sua chave de API da plataforma de IA (OpenAI, etc.) é um segredo e **NUNCA** deve ser exposta no código do frontend (HTML, CSS, JavaScript) ou em repositórios públicos.
    *   O backend/proxy é responsável por armazenar de forma segura a chave da API e fazer as chamadas para o serviço de IA. O frontend se comunica com seu backend, que então repassa a requisição para a IA.

*   **Custos de Uso da API:**
    *   O uso de APIs de IA generativa, como as da OpenAI, geralmente incorre em custos. Estes custos são tipicamente baseados no número de "tokens" processados, tanto os enviados na requisição (prompt, histórico da conversa) quanto os recebidos na resposta (narrativa gerada pela IA).
    *   É crucial estar ciente da estrutura de preços da API de IA que você escolher utilizar.
    *   Monitore regularmente seu uso e orçamento na plataforma da IA para evitar surpresas.

*   **Configuração do Desenvolvedor:**
    *   Para executar este projeto com uma IA real, você precisará:
        1.  Obter uma chave de API da plataforma de IA de sua escolha.
        2.  Configurar e implantar um serviço de backend/proxy que use sua chave de API para se comunicar com a IA.
        3.  Atualizar a constante `API_ENDPOINT_IA` no arquivo `script.js` para apontar para o seu backend.

Este projeto, em seu estado atual no repositório, utiliza uma **simulação de IA no frontend** para fins de desenvolvimento e demonstração, não realizando chamadas reais a APIs externas e, portanto, não incorrendo em custos diretos de API. A integração com um backend real é um passo adicional a ser implementado pelo desenvolvedor.

---

*Este README substitui o conteúdo anterior referente ao "Gerador de Imagens Estilo Mangá/Anime", pois o escopo do projeto foi alterado.*
