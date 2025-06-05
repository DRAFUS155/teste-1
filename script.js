document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementos
    const historiaDiv = document.getElementById('historia');
    const opcoesDiv = document.getElementById('opcoes');
    const inputJogador = document.getElementById('input-jogador');
    const enviarAcaoButton = document.getElementById('enviar-acao');
    const salvarJogoButton = document.getElementById('salvar-jogo-button');
    const carregarJogoButton = document.getElementById('carregar-jogo-button');
    const nomeJogadorSpan = document.getElementById('nome-jogador');
    const nivelJogadorSpan = document.getElementById('nivel-jogador');
    const xpJogadorSpan = document.getElementById('xp-jogador');
    const xpProximoNivelJogadorSpan = document.getElementById('xp-proximo-nivel-jogador');
    const hpJogadorSpan = document.getElementById('hp-jogador');
    const hpMaxJogadorSpan = document.getElementById('hp-max-jogador');
    const mpJogadorSpan = document.getElementById('mp-jogador');
    const mpMaxJogadorSpan = document.getElementById('mp-max-jogador');
    const forcaJogadorSpan = document.getElementById('forca-jogador');
    const destrezaJogadorSpan = document.getElementById('destreza-jogador');
    const inteligenciaJogadorSpan = document.getElementById('inteligencia-jogador');
    const carismaJogadorSpan = document.getElementById('carisma-jogador');
    const ouroJogadorSpan = document.getElementById('ouro-jogador');

    // --- CONFIGURAÇÕES E ESTADO DO JOGO ---
    const API_ENDPOINT_IA = '/api/generate-narrative';

    // 4. Revisar Instruções de Comprimento da Resposta no SYSTEM_PROMPT
    const SYSTEM_PROMPT = `Você é um Mestre de Jogo (Game Master) para um RPG de texto interativo em português do Brasil. Seu objetivo é criar uma experiência narrativa envolvente e dinâmica para o jogador.
Regras e Diretrizes:
1.  **Narrativa Concisa e Envolvente:** Descreva cenários, eventos e as consequências das ações do jogador de forma clara, interessante e, geralmente, concisa (1-3 parágrafos curtos). Use linguagem rica e imersiva. Mantenha um tom consistente com o gênero de fantasia medieval. Após cada resposta sua, aguarde a próxima ação do jogador via texto livre.
2.  **Respostas Curtas e Diretas:** Para ações simples do jogador ou quando a situação pedir (ex: resultado de um ataque, uma pergunta simples), forneça respostas mais curtas e diretas para manter o jogo fluindo.
3.  **Estado do Jogador:** Você receberá o estado atual do personagem (nome, nível, PV, PM, atributos, inventário, local, missões ativas) e o histórico recente da conversa. Use essas informações para contextualizar suas respostas e manter a continuidade.
4.  **Interpretação de Ações:**
    *   Interprete as ações do jogador da forma mais sensata possível.
    *   **Ações Vagas/Ambíguas:** Se uma ação for muito vaga (ex: "explorar"), peça esclarecimento ou forneça uma descrição geral do que ele percebe ao tentar a ação. Ex: "Você explora a área, mas não encontra nada de novo. O que você gostaria de examinar mais de perto?".
    *   **Ações Impossíveis/Fora do Escopo:** Se o jogador tentar algo claramente impossível (ex: "voar sem magia"), descreva a tentativa e a falha de forma realista dentro do mundo do jogo. Ex: "Você agita os braços vigorosamente, mas o máximo que consegue é pular um pouco do chão." Não diga apenas "você não pode fazer isso".
5.  **Progressão e Desafios:** Apresente desafios e permita que o jogador use seus atributos e itens de forma criativa.
6.  **Mudanças de Estado (Tags XML):** Use o formato EXATO especificado. Seja sutil na narrativa para que as tags pareçam uma consequência natural.
    *   `<ouro>[+-]valor</ouro>` (Ex: Encontrou <ouro>10</ouro> moedas.)
    *   `<item nome="Nome do Item" quantidade="[+-]valor" />` (Ex: Ganhou <item nome="Poção de Cura" quantidade="1" />. Usou <item nome="Adaga" quantidade="-1"/> se quebrou.)
    *   `<pv>[+-]valor</pv>` (Ex: Sofreu <pv>-15</pv> PV. Curou <pv>5</pv> PV.)
    *   `<pm>[+-]valor</pm>` (Ex: Usou <pm>-10</pm> PM.)
    *   `<xp>valor</xp>` (Ex: Ganhou <xp>25</xp> XP.)
    *   `<local novo_local="Nome do Novo Local" descricao_curta="Um breve vislumbre do que mudou ou do novo local." />`
    *   `<npc nome="Nome NPC" status_hostil="true/false/neutro" dialogo="O NPC diz algo relevante ou uma saudação." />` (Use 'neutro' se não for nem hostil nem explicitamente amigável)
    *   `<missao nome="Nome Missão" estado="iniciada/concluida/falhada/atualizada" objetivo="Descrição clara do objetivo atual." />`
7.  **Opções de Escolha (Opcional e Raro):** Use `<opcao>Texto da Opção</opcao>` MUITO RARAMENTE, apenas para momentos cruciais onde opções claras são essenciais ou para ensinar o jogador sobre uma nova mecânica complexa. Na maioria das vezes, NÃO forneça opções explícitas; deixe o jogador decidir o que fazer via texto livre.
8.  **Ritmo e Exploração:** Avance a história quando o jogador realizar ações significativas, mas permita momentos de exploração e interação com o ambiente se o jogador assim o desejar. Não apresse o jogador.
9.  **Consistência de NPCs:** Tente manter a consistência na personalidade, conhecimento e comportamento dos NPCs que você introduz. Se um NPC é amigável, ele deve continuar agindo assim, a menos que uma ação do jogador justifique uma mudança drástica. NPCs devem reagir às ações do jogador de forma crível.
10. **Perguntas do Jogador:** Responda brevemente a perguntas do jogador sobre o estado atual do mundo, personagens conhecidos na cena ou regras básicas, se fizer sentido narrativamente. Se o personagem do jogador não souber a resposta, indique isso. Ex: "Você pergunta ao guarda sobre a torre amaldiçoada. Ele franze a testa e diz: 'Ninguém que foi até lá voltou para contar a história, meu caro.'"
11. **Não quebre a imersão:** Não se refira a si mesmo como IA ou Mestre. Apenas narre. Evite frases como "O que você gostaria de fazer agora?". Após sua narrativa, simplesmente pare e espere a próxima ação do jogador.
Lembre-se: o objetivo é criar uma aventura divertida e memorável, incentivando a proatividade do jogador!`;

    // 3. Revisar MAX_HISTORICO (confirmado como 10)
    let historicoConversaIA = [];
    const MAX_HISTORICO = 10;

    let jogador = { /* ... (objeto jogador) ... */ };

    // --- FUNÇÕES PRINCIPAIS DA INTERFACE E ESTADO ---
    function atualizarStatusPersonagem() { /* ... */ }
    function exibirNaHistoria(texto, tipo = 'narrativa') { /* ... */ }
    function exibirOpcoes(listaDeOpcoes) { /* ... */ }
    function controlarEntradaUsuario(habilitar, placeholderMsg = "O que você faz a seguir?") { /* ... */ }
    function adicionarAoHistoricoIA(role, content) { /* ... */ }
    function obterHistoricoRecente() { /* ... */ }
    function gameOver() { /* ... */ }

    // 2. Adicionar Comentários de Alerta no script.js
    async function obterNarrativaDaIA(acaoJogador) {
        // ATENÇÃO: Esta função simula uma chamada para um backend.
        // O backend real é responsável por fazer a chamada à API da IA (ex: OpenAI GPT-4)
        // de forma segura, protegendo a chave da API.
        // O uso da API da IA incorre em custos. Monitore seu uso e orçamento.

        if (!jogador.estaVivo) return null;
        controlarEntradaUsuario(false, "A IA está tecendo o destino...");
        const dadosParaIA = { system_prompt: SYSTEM_PROMPT, personagem: { ...jogador }, cena_atual: jogador.localAtual, historico_conversa: obterHistoricoRecente() };

        try {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 700));
            let respostaSimulada = { narrativa: "" };
            const acaoLower = acaoJogador.toLowerCase();
            const localLower = jogador.localAtual.toLowerCase();

            if (acaoLower.startsWith("começar o jogo como")) {
                respostaSimulada.narrativa = `Você é ${jogador.nome}. A ${jogador.localAtual} é tranquila, banhada pelo sol da manhã. As árvores ao redor formam uma barreira natural, mas uma trilha estreita segue para o norte. A leste, você nota uma entrada rochosa escura que parece ser uma caverna. Um <npc nome="Velho Eremita" status_hostil="false" dialogo="Hmm, um novo rosto por estas bandas..." /> observa você debaixo de uma grande árvore. <missao nome="O Conselho do Eremita" estado="iniciada" objetivo="Fale com o Velho Eremita para entender onde você está." />`;
            }
            else if (acaoLower.includes("atacar") || acaoLower.includes("lutar")) {
                const danoSofrido = Math.floor(Math.random() * 20) + 10;
                const danoCausado = Math.floor(Math.random() * (jogador.forca / 1.5)) + 5;
                respostaSimulada.narrativa = `Com um grito ecoando pela ${localLower}, você investe! Sua ${jogador.inventario.includes("Espada Curta Gasta") ? "espada curta gasta" : "arma improvisada"} corta o ar.
                    Você desfere um golpe certeiro, arrancando um grunhido de dor do seu oponente (imaginário)! <pv>-${danoCausado}</pv> (dano causado).
                    Mas a criatura não recua e te atinge com um golpe brutal! Uma dor lancinante te percorre. <pv>-${danoSofrido}</pv> (dano sofrido). <xp>15</xp> O combate continua!`;
            }
            else if (acaoLower.includes("abrir") && (acaoLower.includes("baú") || acaoLower.includes("bau"))) {
                 if (localLower.includes("caverna do tesouro") || (localLower.includes("caverna") && acaoLower.includes("baú da caverna"))) {
                    respostaSimulada.narrativa = `O pesado tampo do baú range ao ser aberto. Dentro, sob uma camada de poeira, você descobre uma <item nome="Elixir de Cura Leve" quantidade="1"/>, um pequeno saco com <ouro>75</ouro> moedas de ouro brilhantes e um <item nome="Mapa Desenhado à Mão" quantidade="1"/>. <xp>40</xp> <opcao>Beber elixir de cura</opcao> <opcao>Examinar mapa desenhado à mão</opcao> <opcao>Sair da gruta</opcao>`;
                 } else {
                    respostaSimulada.narrativa = `Você procura por um baú para abrir, mas não encontra nenhum por perto em '${jogador.localAtual}'.`;
                 }
            }
            else if (acaoLower.includes("olhar") || acaoLower.includes("examinar") || acaoLower.includes("observar")) {
                if (localLower === "clareira ensolarada") {
                    respostaSimulada.narrativa = `Você está na ${jogador.localAtual}. O sol da manhã ilumina a área, revelando uma trilha para o norte e uma entrada de caverna a leste. O Velho Eremita ainda está sob a árvore, parecendo esperar algo.`;
                } else if (localLower.includes("floresta sombria antiga")) {
                     respostaSimulada.narrativa = `A ${jogador.localAtual} é um emaranhado de árvores retorcidas e sombras profundas. O ar é frio e úmido. O silêncio é quebrado apenas pelo som de seus próprios passos e pelo vento que sussurra entre os galhos.`;
                } else if (localLower.includes("entrada da caverna ecoante")){
                     respostaSimulada.narrativa = `Você se encontra na ${jogador.localAtual}. Ecos estranhos emanam das profundezas escuras. O chão é rochoso e escorregadio. A escuridão à frente é total.`;
                } else if (localLower.includes("caverna do tesouro")) {
                     respostaSimulada.narrativa = `Você está na pequena gruta onde encontrou o baú. As paredes brilham suavemente com os cristais. O ar é úmido e parado. A única saída aparente é por onde você entrou.`;
                } else {
                    respostaSimulada.narrativa = `Você está em ${jogador.localAtual}. A IA descreve: O vento uiva pelas planícies abertas. Algumas rochas oferecem abrigo escasso. O horizonte é vasto e um tanto intimidador.`;
                }
            }
            else if ((acaoLower.includes("usar") || acaoLower.includes("beber")) && (acaoLower.includes("elixir de cura leve") || acaoLower.includes("elixir")) && jogador.inventario.includes("Elixir de Cura Leve")) {
                 respostaSimulada.narrativa = `Você desarrolha o Elixir de Cura Leve e bebe o líquido esverdeado. Um calor agradável se espalha pelo seu corpo, aliviando suas dores mais recentes. Você recupera <pv>30</pv> PV. <item nome="Elixir de Cura Leve" quantidade="-1"/>`;
            }
            else if (acaoLower.includes("norte") || acaoLower.includes("ir para o norte")) {
                if (localLower === "clareira ensolarada") {
                    respostaSimulada.narrativa = `Você decide seguir a trilha para o norte. <local novo_local="Trilha na Floresta Antiga" descricao_curta="A trilha estreita serpenteia entre árvores antigas." /> A floresta se torna mais densa a cada passo. O caminho à frente é incerto, coberto por sombras.`;
                } else {
                    respostaSimulada.narrativa = `Você tenta ir para o norte, mas a partir de '${jogador.localAtual}', o caminho parece bloqueado ou inexistente.`;
                }
            } else if (acaoLower.includes("leste") || acaoLower.includes("ir para leste")) {
                 if (localLower === "clareira ensolarada") {
                    respostaSimulada.narrativa = `Você se aproxima da entrada rochosa a leste. Uma corrente de ar frio e úmido emana de seu interior escuro. <local novo_local="Entrada da Caverna Ecoante" descricao_curta="A boca da caverna é escura e pressentidora." />`;
                } else {
                    respostaSimulada.narrativa = `Não há um caminho claro para o leste a partir de '${jogador.localAtual}'.`;
                }
            }
            else if ((acaoLower.includes("falar com") || acaoLower.includes("conversar com")) && acaoLower.includes("eremita") && localLower.includes("clareira ensolarada")) {
                respostaSimulada.narrativa = `O Velho Eremita levanta a cabeça lentamente e fita você com olhos surpreendentemente astutos. "Finalmente decidiu falar, é? Muitos passam por aqui, poucos param para ouvir um velho." Ele coça a barba. "O que perturba sua jornada, ${jogador.nome}?" <xp>10</xp> <missao nome="O Conselho do Eremita" estado="atualizada" objetivo="Faça uma pergunta específica ao Eremita ou peça um conselho." /> <opcao>Perguntar sobre a floresta ao norte</opcao> <opcao>Perguntar sobre a caverna a leste</opcao> <opcao>Pedir um conselho para um aventureiro</opcao> <opcao>Despedir-se</opcao>`;
            }
            else if (acaoLower === "perguntar sobre a floresta") {
                respostaSimulada.narrativa = `O Eremita suspira. "A floresta ao norte... é antiga, mais antiga que as montanhas, dizem alguns. Perigos espreitam em suas sombras, mas também segredos e, para os sortudos, recompensas. Vá com cuidado, e não confie nas sombras que dançam." <xp>5</xp>`;
            } else if (acaoLower === "perguntar sobre a caverna") {
                respostaSimulada.narrativa = `"Ah, a caverna..." os olhos do Eremita parecem distantes. "Muitos já tentaram desvendá-la. Alguns encontraram tesouros, outros apenas o silêncio eterno. Dizem que guarda mais do que pedras e escuridão." <xp>5</xp>`;
            }
            else if (acaoLower.includes("explorar")) {
                respostaSimulada.narrativa = `Você começa a explorar mais atentamente a área da ${jogador.localAtual}. ${localLower.includes("clareira") ? "Você verifica atrás de algumas rochas e no tronco de uma árvore caída, mas não encontra nada de novo." : "Você se move com cautela, observando os detalhes do ambiente, mas nada de extraordinário se revela imediatamente."} Seja mais específico se procura algo em particular. <xp>2</xp>`;
            }
             else {
                respostaSimulada.narrativa = `Sua ação '${acaoJogador}' ecoa pelo local. O Mestre observa seus movimentos, e o mundo ao seu redor parece aguardar seu próximo passo. <xp>3</xp>`;
            }

            return respostaSimulada.narrativa;

        } catch (error) {
            exibirNaHistoria("Houve um erro na simulação da IA. Tentando novamente com uma resposta padrão.", "sistema-erro");
            console.error("Erro em obterNarrativaDaIA (simulado):", error);
            return "O fluxo do destino foi interrompido por um instante. Tente sua ação novamente ou algo diferente. <xp>1</xp>";
        }
        finally { if (jogador.estaVivo) controlarEntradaUsuario(true); }
    }

    function processarRespostaIA(textoNarrativa) { /* ... (Colar a função completa da etapa anterior aqui, pois ela já está correta com os parsers de tags) ... */
        adicionarAoHistoricoIA("assistant", textoNarrativa);
        let narrativaProcessada = textoNarrativa;

        narrativaProcessada = narrativaProcessada.replace(/<ouro>([+-]?\d+)<\/ouro>/gi, (match, valorStr) => {
            const valor = parseInt(valorStr); jogador.ouro += valor;
            const msg = valor >= 0 ? `(Você ${valor === 0 ? 'não encontrou' : 'encontrou'} ${valor} de ouro!)` : `(Você perdeu ${Math.abs(valor)} de ouro!)`;
            exibirNaHistoria(msg, "sistema-notificacao"); return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<item nome="(.*?)" quantidade="([+-]?\d+)"\s?\/>/gi, (match, nomeItem, quantidadeStr) => {
            const quantidade = parseInt(quantidadeStr);
            if (quantidade > 0) { for(let i=0; i<quantidade; i++) jogador.inventario.push(nomeItem); exibirNaHistoria(`(Você obteve: <strong>${nomeItem}</strong>${quantidade > 1 ? ' x'+quantidade : ''}!)`, "sistema-item"); }
            else { let removidos = 0; for (let i = 0; i < Math.abs(quantidade); i++) { const index = jogador.inventario.indexOf(nomeItem); if (index > -1) { jogador.inventario.splice(index, 1); removidos++; } else break; }
                if (removidos > 0) exibirNaHistoria(`(Você usou/perdeu: <strong>${nomeItem}</strong>${removidos > 1 ? ' x'+removidos : ''}!)`, "sistema-item");
                else { narrativaProcessada += ` (Você tentou usar ${nomeItem}, mas não o possui.)`; return "";}
            } return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<pv>([+-]?\d+)<\/pv>/gi, (match, valorStr) => {
            if (!jogador.estaVivo) return ""; const valor = parseInt(valorStr); const pvAnterior = jogador.pv; jogador.pv = Math.min(jogador.pvMax, Math.max(0, jogador.pv + valor));
            const diffPv = jogador.pv - pvAnterior; if (diffPv < 0) { exibirNaHistoria(`(Você sofreu ${Math.abs(diffPv)} de dano!)`, "sistema-dano");}
            else if (diffPv > 0) { exibirNaHistoria(`(Você recuperou ${diffPv} PV!)`, "sistema-cura");}
            if (jogador.pv === 0) { gameOver(); } return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<pm>([+-]?\d+)<\/pm>/gi, (match, valorStr) => {
            const valor = parseInt(valorStr); const pmAnterior = jogador.pm; jogador.pm = Math.min(jogador.pmMax, Math.max(0, jogador.pm + valor));
            const diffPm = jogador.pm - pmAnterior; if (diffPm < 0) exibirNaHistoria(`(Você gastou ${Math.abs(diffPm)} PM!)`, "sistema-magia");
            else if (diffPm > 0) exibirNaHistoria(`(Você recuperou ${diffPm} PM!)`, "sistema-magia"); return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<xp>(\d+)<\/xp>/gi, (match, valorStr) => {
            const valor = parseInt(valorStr); if (valor > 0) { jogador.xp += valor; exibirNaHistoria(`(Você ganhou ${valor} XP!)`, "sistema-notificacao");
                if (jogador.xp >= jogador.xpParaProximoNivel) { jogador.nivel++; jogador.xp -= jogador.xpParaProximoNivel; jogador.xpParaProximoNivel = Math.floor(jogador.xpParaProximoNivel * 1.5);
                    jogador.pvMax += 10; jogador.pmMax += 5; jogador.forca +=1; jogador.destreza +=1; jogador.inteligencia +=1; jogador.pv = jogador.pvMax; jogador.pm = jogador.pmMax;
                    exibirNaHistoria(`<strong>Parabéns! Você alcançou o Nível ${jogador.nivel}!</strong> Seus atributos e status foram restaurados e aumentados.`, "sistema-levelup"); } } return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<local novo_local="(.*?)" descricao_curta="(.*?)"\s?\/>/gi, (match, novoLocal, descCurta) => {
            if (jogador.localAtual !== novoLocal) { jogador.localAtual = novoLocal; exibirNaHistoria(`(Você chegou em: <strong>${novoLocal}</strong>. ${descCurta})`, "sistema-notificacao");}
            else if (descCurta) { exibirNaHistoria(`(${descCurta})`, "sistema-notificacao");} return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<npc nome="(.*?)" status_hostil="(true|false|neutro)" dialogo="(.*?)"\s?\/>/gi, (match, nomeNpc, hostil, dialogo) => {
            let statusTexto = ""; if(hostil === "true") statusTexto = "hostil"; else if(hostil === "false") statusTexto = "amigável"; else statusTexto = "neutro";
            exibirNaHistoria(`(Um ${statusTexto} <strong>${nomeNpc}</strong> ${hostil === "true" ? "rosna" : "diz"}: "${dialogo}")`, "sistema-dialogo-npc"); return "";
        });
        narrativaProcessada = narrativaProcessada.replace(/<missao nome="(.*?)" estado="(.*?)" objetivo="(.*?)"\s?\/>/gi, (match, nomeMissao, estado, objetivo) => {
            jogador.missoes[nomeMissao] = estado; let estadoTraduzido = estado; if(estado === "iniciada") estadoTraduzido = "iniciada"; if(estado === "concluida") estadoTraduzido = "concluída"; if(estado === "falhada") estadoTraduzido = "falhou"; if(estado === "atualizada") estadoTraduzido = "atualizada";
            exibirNaHistoria(`(Missão ${estadoTraduzido}: <strong>${nomeMissao}</strong>. Objetivo: ${objetivo})`, "sistema-missao"); return "";
        });

        const opcoesDetectadas = [];
        narrativaProcessada = narrativaProcessada.replace(/<opcao>(.*?)<\/opcao>/gi, (match, textoOpcao) => {
            opcoesDetectadas.push({ texto: textoOpcao, callbackIA: true });
            return "";
        });

        if (narrativaProcessada.trim()) {
            exibirNaHistoria(narrativaProcessada.trim(), "ia");
        }
        atualizarStatusPersonagem();
        if (jogador.estaVivo) { exibirOpcoes(opcoesDetectadas); }
    }


    // --- FUNÇÕES DE JOGO (SALVAR, CARREGAR, INICIAR, PROCESSAR COMANDO) ---
    // Funções omitidas para brevidade, colar da versão anterior:
    // salvarJogo, carregarJogo, processarComando, listeners de evento, iniciarJogo
    // Nenhuma mudança significativa nelas é esperada para esta tarefa, exceto a inicialização de `jogador` em `iniciarJogo`.
    function salvarJogo() {
        try {
            const estadoDoJogo = { jogador: jogador, historiaHTML: historiaDiv.innerHTML, historicoConversaIA: historicoConversaIA };
            localStorage.setItem('rpgJogoSalvo', JSON.stringify(estadoDoJogo));
            exibirNaHistoria("<strong>Jogo salvo com sucesso!</strong>", "sistema-sucesso");
        } catch (error) { console.error("Erro ao salvar o jogo:", error); exibirNaHistoria("<strong>Erro ao salvar o jogo.</strong> Verifique o console.", "sistema-erro"); if (error.name === 'QuotaExceededError') {exibirNaHistoria("Não há espaço suficiente para salvar o jogo.", "sistema-erro");}}
    }

    function carregarJogo() {
        try {
            const dadosSalvosJSON = localStorage.getItem('rpgJogoSalvo');
            if (dadosSalvosJSON) {
                const estadoDoJogoSalvo = JSON.parse(dadosSalvosJSON);
                jogador = estadoDoJogoSalvo.jogador;
                if (estadoDoJogoSalvo.historiaHTML) historiaDiv.innerHTML = estadoDoJogoSalvo.historiaHTML;
                else historiaDiv.innerHTML = '';
                historicoConversaIA = estadoDoJogoSalvo.historicoConversaIA || [];
                atualizarStatusPersonagem();
                historiaDiv.scrollTop = historiaDiv.scrollHeight;
                if (jogador.estaVivo) {
                    exibirNaHistoria("<strong>Jogo carregado com sucesso!</strong> Digite 'olhar ao redor' para se situar.", "sistema-sucesso");
                } else {
                    exibirNaHistoria("<strong>Jogo carregado.</strong> Você havia encontrado seu fim. Pode tentar carregar um save anterior (se houver) ou reiniciar.", "sistema-aviso");
                }
                if (jogador.estaVivo) { exibirOpcoes([]); }
                else { gameOver(); }
            } else { exibirNaHistoria("Nenhum jogo salvo encontrado.", "sistema-aviso"); }
        } catch (error) { console.error("Erro ao carregar o jogo:", error); exibirNaHistoria("<strong>Erro ao carregar o jogo.</strong> Os dados podem estar corrompidos.", "sistema-erro");}
    }

    if (salvarJogoButton) salvarJogoButton.addEventListener('click', salvarJogo);
    if (carregarJogoButton) carregarJogoButton.addEventListener('click', carregarJogo);

    async function processarComando(comando) {
        if (!jogador.estaVivo && comando.toLowerCase() !== "carregar") {
            exibirNaHistoria("Você não pode fazer isso agora. Seu personagem não está mais entre os vivos.", "sistema-erro");
            return;
        }
        const comandoLower = comando.toLowerCase();
        if (comandoLower === "salvar") { salvarJogo(); return; }
        else if (comandoLower === "carregar") { carregarJogo(); return; }
        else if (comandoLower === "ajuda" || comandoLower === "comandos") {
            exibirNaHistoria("Comandos úteis: <strong>olhar ao redor</strong>, <strong>status</strong>, <strong>inventario</strong>, <strong>salvar</strong>, <strong>carregar</strong>, <strong>ajuda</strong>. Qualquer outra coisa será sua ação na história.", "sistema-info");
            if (opcoesDiv.children.length === 0 && jogador.estaVivo) exibirOpcoes([]);
            return;
        } else if (comandoLower === "status" || comandoLower === "personagem") {
            exibirNaHistoria(`--- STATUS ---<br>Nome: ${jogador.nome}<br>Nível: ${jogador.nivel} (XP: ${jogador.xp}/${jogador.xpParaProximoNivel})<br>PV: ${jogador.pv}/${jogador.pvMax} | PM: ${jogador.pm}/${jogador.pmMax}<br>For: ${jogador.forca} | Des: ${jogador.destreza} | Int: ${jogador.inteligencia} | Car: ${jogador.carisma}<br>Ouro: ${jogador.ouro}<br>----------------`, "sistema-info");
            atualizarStatusPersonagem();
            if (opcoesDiv.children.length === 0 && jogador.estaVivo) exibirOpcoes([]);
            return;
        } else if (comandoLower === "inventario" || comandoLower === "itens" || comandoLower === "bolsa") {
            if (jogador.inventario.length > 0) {
                exibirNaHistoria(`No seu inventário: <strong>${jogador.inventario.join(", ")}</strong>.`, "sistema-info");
            } else { exibirNaHistoria("Seu inventário está vazio.", "sistema-info");}
            if (opcoesDiv.children.length === 0 && jogador.estaVivo) exibirOpcoes([]);
            return;
        }
        adicionarAoHistoricoIA("user", comando);
        const narrativaGerada = await obterNarrativaDaIA(comando);
        if (narrativaGerada) { processarRespostaIA(narrativaGerada); }
        else if (!jogador.estaVivo && !narrativaGerada) { /* gameOver já foi chamado */ }
    }

    enviarAcaoButton.addEventListener('click', () => {
        const comando = inputJogador.value.trim();
        if (comando && !inputJogador.disabled) {
            exibirNaHistoria(`&gt; ${comando}`, 'acao-jogador');
            processarComando(comando);
            inputJogador.value = '';
        }
    });
    inputJogador.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !inputJogador.disabled) {
            enviarAcaoButton.click();
        }
    });

    function iniciarJogo() {
        historiaDiv.innerHTML = '';
        historicoConversaIA = [];
        jogador = {
            nome: "Valerius", nivel: 1, xp: 0, xpParaProximoNivel: 100, pv: 100, pvMax: 100, pm: 50, pmMax: 50,
            forca: 12, destreza: 10, inteligencia: 11, carisma: 9, ouro: 30,
            localAtual: "Clareira Ensolarada",
            inventario: ["Espada Curta Gasta", "Mochila de Couro", "Pederneira"],
            estaVivo: true, missoes: {}
        };

        exibirNaHistoria("Bem-vindo ao Mundo de Textos Interativos!", "sistema-titulo");
        const acaoInicial = `Começar o jogo como ${jogador.nome} em ${jogador.localAtual}. Descreva o local e introduza um NPC inicial.`;
        adicionarAoHistoricoIA("user", acaoInicial);

        atualizarStatusPersonagem();

        (async () => {
            controlarEntradaUsuario(false, "Criando seu mundo...");
            const narrativaInicial = await obterNarrativaDaIA(acaoInicial);
            if (narrativaInicial) {
                processarRespostaIA(narrativaInicial);
            } else {
                exibirNaHistoria(`Você é <strong>${jogador.nome}</strong>. ${jogador.localAtual ? `Você se encontra em: <strong>${jogador.localAtual}</strong>.` : 'Seu ambiente ainda é um mistério.'} O que você faz?`, "narrativa-ambiente");
                if(jogador.estaVivo) exibirOpcoes([]);
            }
        })();
    }

    iniciarJogo();
});
