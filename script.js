document.addEventListener('DOMContentLoaded', () => {
    // 1. Acessar Elementos do DOM
    const historiaDiv = document.getElementById('historia');
    const opcoesDiv = document.getElementById('opcoes');
    const inputJogador = document.getElementById('input-jogador');
    const enviarAcaoButton = document.getElementById('enviar-acao');
    const salvarJogoButton = document.getElementById('salvar-jogo-button');
    const carregarJogoButton = document.getElementById('carregar-jogo-button'); // Novo botão

    // Referências para os spans específicos do status do personagem
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

    // 2. Objeto `jogador`
    let jogador = {
        nome: "Aventureiro Destemido",
        nivel: 1,
        xp: 0,
        xpParaProximoNivel: 100,
        pv: 100,
        pvMax: 100,
        pm: 50,
        pmMax: 50,
        forca: 10,
        destreza: 10,
        inteligencia: 10,
        carisma: 10,
        ouro: 25,
        localAtual: "clareira",
        inventario: ["Mapa simples", "Adaga básica"]
    };

    // 3. Função `atualizarStatusPersonagem()`
    function atualizarStatusPersonagem() {
        if (nomeJogadorSpan) nomeJogadorSpan.textContent = jogador.nome;
        if (nivelJogadorSpan) nivelJogadorSpan.textContent = jogador.nivel;
        if (xpJogadorSpan) xpJogadorSpan.textContent = jogador.xp;
        if (xpProximoNivelJogadorSpan) xpProximoNivelJogadorSpan.textContent = jogador.xpParaProximoNivel;
        if (hpJogadorSpan) hpJogadorSpan.textContent = jogador.pv;
        if (hpMaxJogadorSpan) hpMaxJogadorSpan.textContent = jogador.pvMax;
        if (mpJogadorSpan) mpJogadorSpan.textContent = jogador.pm;
        if (mpMaxJogadorSpan) mpMaxJogadorSpan.textContent = jogador.pmMax;
        if (forcaJogadorSpan) forcaJogadorSpan.textContent = jogador.forca;
        if (destrezaJogadorSpan) destrezaJogadorSpan.textContent = jogador.destreza;
        if (inteligenciaJogadorSpan) inteligenciaJogadorSpan.textContent = jogador.inteligencia;
        if (carismaJogadorSpan) carismaJogadorSpan.textContent = jogador.carisma;
        if (ouroJogadorSpan) ouroJogadorSpan.textContent = jogador.ouro;
    }

    // 4. Função `exibirNaHistoria(texto, tipo = 'narrativa')`
    function exibirNaHistoria(texto, tipo = 'narrativa') {
        const novaLinha = document.createElement('p');
        novaLinha.innerHTML = texto;
        novaLinha.className = `mensagem-historia tipo-${tipo} my-1`; // my-1 para um pouco de margem
        historiaDiv.appendChild(novaLinha);
        historiaDiv.scrollTop = historiaDiv.scrollHeight; // Mantém a última mensagem visível
    }

    // 5. Função `exibirOpcoes(listaDeOpcoes)`
    function exibirOpcoes(listaDeOpcoes) {
        opcoesDiv.innerHTML = '';
        const botoesAcaoContainer = document.getElementById('botoes-acao-container');

        if (!listaDeOpcoes || listaDeOpcoes.length === 0) {
            inputJogador.style.display = 'block';
            if (botoesAcaoContainer) botoesAcaoContainer.style.display = 'flex';
            inputJogador.focus();
            return;
        }

        inputJogador.style.display = 'none';
        if (botoesAcaoContainer) botoesAcaoContainer.style.display = 'none'; // Esconde todo o container de botões de ação

        listaDeOpcoes.forEach(opcao => {
            const botaoOpcao = document.createElement('button');
            botaoOpcao.textContent = opcao.texto;
            botaoOpcao.className = 'opcao-jogador btn btn-outline-light btn-block my-1';
            botaoOpcao.addEventListener('click', () => {
                exibirNaHistoria(`&gt; ${opcao.texto}`, 'escolha-jogador');
                // Mostrar novamente o container de botões de ação após uma escolha de opção de história
                // pois a callback pode não apresentar novas opções de história, revertendo para input de texto.
                if (botoesAcaoContainer) botoesAcaoContainer.style.display = 'flex';
                if (opcao.callback) {
                    opcao.callback();
                } else {
                    exibirNaHistoria("Essa opção ainda não foi implementada.", "sistema-aviso");
                }
            });
            opcoesDiv.appendChild(botaoOpcao);
        });
    }

    // --- FUNÇÕES SALVAR E CARREGAR JOGO ---
    function salvarJogo() {
        try {
            const estadoDoJogo = {
                jogador: jogador,
                historiaHTML: historiaDiv.innerHTML
            };
            localStorage.setItem('rpgJogoSalvo', JSON.stringify(estadoDoJogo));
            exibirNaHistoria("<strong>Jogo salvo com sucesso!</strong>", "sistema-sucesso");
        } catch (error) {
            console.error("Erro ao salvar o jogo:", error);
            exibirNaHistoria("<strong>Erro ao salvar o jogo.</strong> Verifique o console.", "sistema-erro");
            if (error.name === 'QuotaExceededError') {
                 exibirNaHistoria("Não há espaço suficiente para salvar o jogo.", "sistema-erro");
            }
        }
    }

    function carregarJogo() {
        try {
            const dadosSalvosJSON = localStorage.getItem('rpgJogoSalvo');
            if (dadosSalvosJSON) {
                const estadoDoJogoSalvo = JSON.parse(dadosSalvosJSON);

                // Restaurar estado do jogador
                // É mais seguro atribuir propriedade por propriedade se a estrutura do objeto 'jogador' puder mudar
                // ou se o objeto salvo puder ser malicioso/corrompido de formas complexas.
                // Por simplicidade, faremos uma atribuição direta, mas cientes do risco.
                jogador = estadoDoJogoSalvo.jogador;

                // Restaurar história
                if (estadoDoJogoSalvo.historiaHTML) {
                    historiaDiv.innerHTML = estadoDoJogoSalvo.historiaHTML;
                } else {
                    historiaDiv.innerHTML = ''; // Limpa se não houver histórico salvo
                    exibirNaHistoria("Histórico não encontrado nos dados salvos, começando com histórico limpo.", "sistema-aviso");
                }

                atualizarStatusPersonagem();
                historiaDiv.scrollTop = historiaDiv.scrollHeight; // Rola para o final do histórico carregado
                exibirNaHistoria("<strong>Jogo carregado com sucesso!</strong> Digite 'olhar ao redor' para se situar.", "sistema-sucesso");

                // Após carregar, limpar as opções atuais e mostrar o input para o jogador decidir o que fazer.
                exibirOpcoes([]);

            } else {
                exibirNaHistoria("Nenhum jogo salvo encontrado.", "sistema-aviso");
            }
        } catch (error) {
            console.error("Erro ao carregar o jogo:", error);
            exibirNaHistoria("<strong>Erro ao carregar o jogo.</strong> Os dados podem estar corrompidos.", "sistema-erro");
            // Opcional: limpar os dados corrompidos
            // localStorage.removeItem('rpgJogoSalvo');
        }
    }

    // Adicionar Event Listeners aos Botões Salvar e Carregar
    if (salvarJogoButton) { // Verifica se o botão existe no DOM
        salvarJogoButton.addEventListener('click', salvarJogo);
    }
    if (carregarJogoButton) { // Verifica se o botão existe no DOM
        carregarJogoButton.addEventListener('click', carregarJogo);
    }


    // --- CENÁRIO INTERATIVO E FUNÇÕES DE CALLBACK ---
    // (Funções como irParaFloresta, explorarCaverna, etc. permanecem aqui)
    function irParaFloresta() {
        jogador.localAtual = "floresta_inicio";
        exibirNaHistoria("Você segue a trilha para o norte, embrenhando-se na floresta. O ar fica mais úmido e os sons da natureza te envolvem. Após alguns minutos, a trilha se bifurca.", "narrativa-ambiente");
        exibirOpcoes([
            { texto: "Seguir pela trilha da esquerda, mais estreita.", callback: trilhaEsquerdaFloresta },
            { texto: "Pegar a trilha da direita, que parece mais usada.", callback: trilhaDireitaFloresta },
            { texto: "Voltar para a clareira.", callback: voltarClareira }
        ]);
    }

    function trilhaEsquerdaFloresta() {
        jogador.localAtual = "floresta_trilha_esquerda";
        exibirNaHistoria("A trilha da esquerda é sinuosa e coberta por raízes. Você encontra um pequeno arbusto com frutas vermelhas de aparência suculenta.", "narrativa");
        exibirOpcoes([
            { texto: "Provar as frutas.", callback: provarFrutas },
            { texto: "Ignorar as frutas e continuar.", callback: continuarTrilhaEsquerda },
            { texto: "Voltar para a bifurcação da floresta.", callback: irParaFloresta }
        ]);
    }

    function provarFrutas() {
        const sorte = Math.random();
        if (sorte < 0.6) {
            exibirNaHistoria("As frutas são doces e revigorantes! Você se sente um pouco melhor.", "narrativa-positiva");
            jogador.pv = Math.min(jogador.pvMax, jogador.pv + 5);
            jogador.xp += 5; // Ganha XP por uma boa descoberta
            atualizarStatusPersonagem();
        } else if (sorte < 0.85) {
             exibirNaHistoria("As frutas são terrivelmente azedas e fazem sua boca repuxar. Que nojo!", "narrativa-negativa");
        } else { // 15% de chance de problema leve
            exibirNaHistoria("Você sente um leve enjoo após comer as frutas. Melhor não comer mais.", "narrativa-negativa");
            jogador.pv = Math.max(0, jogador.pv - 3);
            atualizarStatusPersonagem();
        }
        // Após provar frutas, o container de botões de ação deve ser exibido
        document.getElementById('botoes-acao-container').style.display = 'flex';
        exibirOpcoes([
            { texto: "Continuar pela trilha.", callback: continuarTrilhaEsquerda },
            { texto: "Voltar para a bifurcação da floresta.", callback: irParaFloresta }
        ]);
    }

    function continuarTrilhaEsquerda() {
        exibirNaHistoria("Você continua pela trilha estreita até que ela termina abruptamente diante de um rio de águas rápidas. Parece muito largo para cruzar a nado aqui.", "narrativa-ambiente");
        jogador.localAtual = "floresta_rio";
        exibirOpcoes([
            { texto: "Procurar por uma ponte ou passagem rasa rio acima.", callback: procurarPonteRio },
            { texto: "Voltar para a bifurcação da floresta.", callback: irParaFloresta }
        ]);
    }

    function procurarPonteRio() {
        exibirNaHistoria("Você caminha pela margem do rio e, após algum tempo, encontra uma velha ponte de cordas, bastante precária.", "narrativa");
        exibirOpcoes([
            { texto: "Tentar cruzar a ponte.", callback: cruzarPonteRio },
            { texto: "Melhor não arriscar e voltar.", callback: continuarTrilhaEsquerda }
        ]);
    }

    function cruzarPonteRio() {
        const sorte = Math.random();
        if (sorte < (0.5 + jogador.destreza * 0.02)) { // Chance base + bônus de destreza (exemplo)
            exibirNaHistoria("Com cuidado, você atravessa a ponte rangente e chega ao outro lado em segurança.", "narrativa-positiva");
            jogador.localAtual = "floresta_outro_lado_rio";
            jogador.xp += 15; // XP por cruzar com sucesso
            atualizarStatusPersonagem();
            exibirOpcoes([ {texto: "Explorar esta nova área.", callback: explorarOutroLadoRio} ]); // Novo local, novas opções
        } else {
            exibirNaHistoria("Uma das cordas da ponte arrebenta sob seus pés! Por pouco você não cai. Você consegue voltar, mas a ponte está intransitável.", "narrativa-negativa");
            exibirOpcoes([ {texto: "Voltar pela trilha.", callback: continuarTrilhaEsquerda} ]);
        }
    }

    function explorarOutroLadoRio() {
        exibirNaHistoria("Esta parte da floresta é mais aberta. Você encontra um antigo altar de pedra coberto de musgo.", "narrativa-ambiente");
        jogador.localAtual = "floresta_altar";
        exibirOpcoes([
            {texto: "Examinar o altar.", callback: examinarAltar},
            {texto: "Deixar o altar em paz e voltar (se possível).", callback: voltarPelaPonteOuTrilha}
        ]);
    }

    function examinarAltar() {
        exibirNaHistoria("Ao tocar o altar, você sente uma energia estranha. Uma pequena gema brilhante aparece em sua superfície! Você a pega.", "narrativa-positiva");
        jogador.inventario.push("Gema Brilhante");
        jogador.ouro += 20;
        jogador.xp += 25; // XP por encontrar item importante
        atualizarStatusPersonagem();
        exibirNaHistoria("<strong>Gema Brilhante</strong> foi adicionada ao seu inventário.", "sistema-item");
         exibirOpcoes([
            {texto: "Voltar (se possível).", callback: voltarPelaPonteOuTrilha} // Opção de voltar
        ]);
    }

    function voltarPelaPonteOuTrilha() {
        // Idealmente, verificaríamos o estado da ponte ou de onde o jogador veio.
        // Por simplicidade, retorna para antes da tentativa de cruzar a ponte.
        exibirNaHistoria("Você decide retornar.", "narrativa");
        continuarTrilhaEsquerda();
    }


    function trilhaDireitaFloresta() {
        jogador.localAtual = "floresta_trilha_direita";
        exibirNaHistoria("A trilha da direita é mais larga e parece ter sido usada recentemente. Você vê pegadas de animais grandes no chão.", "narrativa");
        exibirOpcoes([
            { texto: "Seguir as pegadas com cautela.", callback: seguirPegadasAnimais },
            { texto: "Ignorar as pegadas e explorar a área.", callback: explorarAreaPegadas },
            { texto: "Voltar para a bifurcação da floresta.", callback: irParaFloresta }
        ]);
    }

    function seguirPegadasAnimais() {
        exibirNaHistoria("As pegadas te levam a uma pequena clareira onde um cervo está bebendo água de uma poça. Ele te nota!", "narrativa-ambiente");
        exibirOpcoes([
            { texto: "Tentar caçar o cervo.", callback: tentarCacarCervo},
            { texto: "Observar o cervo à distância.", callback: observarCervo},
            { texto: "Afastar-se silenciosamente.", callback: trilhaDireitaFloresta }
        ]);
    }

    function tentarCacarCervo() {
        if (jogador.destreza > 11 || jogador.inventario.includes("Arco Curto")) { // Exemplo de teste de atributo/item
             exibirNaHistoria("Com sua perícia (ou equipamento), você consegue abater o cervo! Você obtém carne e couro.", "narrativa-positiva");
             jogador.inventario.push("Carne de Cervo");
             jogador.inventario.push("Couro de Cervo");
             jogador.xp += 30; // XP por caça bem-sucedida
             atualizarStatusPersonagem();
             exibirNaHistoria("<strong>Carne de Cervo</strong> e <strong>Couro de Cervo</strong> adicionados.", "sistema-item");
        } else {
            exibirNaHistoria("Você tenta se aproximar para caçar, mas sua adaga básica não é suficiente, e o cervo foge rapidamente.", "narrativa-negativa");
        }
         exibirOpcoes([
            { texto: "Voltar para a trilha.", callback: trilhaDireitaFloresta }
        ]);
    }

    function observarCervo() {
        exibirNaHistoria("Você observa o cervo por alguns momentos. É uma criatura majestosa. Ele logo se afasta e desaparece na mata.", "narrativa");
        jogador.xp += 5; // XP por observação pacífica
        atualizarStatusPersonagem();
         exibirOpcoes([
            { texto: "Continuar pela trilha.", callback: trilhaDireitaFloresta }
        ]);
    }

    function explorarAreaPegadas() {
         exibirNaHistoria("Você explora os arredores da trilha e encontra um anel de prata simples no chão, um pouco sujo de terra.", "narrativa-positiva");
         jogador.inventario.push("Anel de Prata");
         jogador.ouro += 5; // Valor do anel
         jogador.xp += 10; // XP por encontrar item
         atualizarStatusPersonagem();
         exibirNaHistoria("<strong>Anel de Prata</strong> foi adicionado ao seu inventário.", "sistema-item");
         exibirOpcoes([
            { texto: "Continuar seguindo a trilha.", callback: trilhaDireitaFloresta },
            { texto: "Voltar para a bifurcação da floresta.", callback: irParaFloresta }
        ]);
    }

    function explorarCaverna() {
        jogador.localAtual = "caverna_entrada";
        exibirNaHistoria("A entrada da caverna é escura e um ar frio sopra de seu interior. Ouve-se o gotejar de água distante.", "narrativa-ambiente");
        exibirOpcoes([
            { texto: "Entrar na caverna.", callback: entrarCaverna },
            { texto: "Voltar para a clareira.", callback: voltarClareira }
        ]);
    }

    function entrarCaverna() {
        jogador.localAtual = "caverna_interior";
        exibirNaHistoria("Você adentra a escuridão. Após alguns passos, seus olhos se acostumam um pouco. Você percebe um brilho fraco no final de um túnel.", "narrativa");
        exibirOpcoes([
            { texto: "Investigar o brilho.", callback: investigarBrilhoCaverna },
            { texto: "Voltar para a entrada da caverna.", callback: explorarCaverna }
        ]);
    }

    function investigarBrilhoCaverna() {
        exibirNaHistoria("O brilho vem de cristais incrustados nas paredes. No centro da pequena gruta, há um baú de madeira.", "narrativa-ambiente");
        jogador.localAtual = "caverna_bau";
        exibirOpcoes([
            { texto: "Abrir o baú.", callback: abrirBauCaverna },
            { texto: "Deixar o baú e sair da caverna.", callback: voltarClareira }
        ]);
    }

    function abrirBauCaverna() {
        exibirNaHistoria("Você abre o baú com esforço. Dentro, encontra um antigo tomo com capa de couro e 30 moedas de ouro!", "narrativa-positiva");
        jogador.ouro += 30;
        jogador.inventario.push("Tomo Antigo");
        jogador.xp += 50; // XP por encontrar tesouro
        atualizarStatusPersonagem();
        exibirNaHistoria("<strong>Tomo Antigo</strong> e <strong>30 Ouro</strong> adicionados.", "sistema-item");
        exibirOpcoes([
            { texto: "Examinar o tomo.", callback: ()=>{
                exibirNaHistoria("O tomo parece conter runas antigas e emana uma leve aura mágica. Você precisará de mais conhecimento para decifrá-lo.", "narrativa");
                // Re-exibe a opção de sair, já que examinar não é um beco sem saída.
                exibirOpcoes([{texto: "Sair da caverna com seu tesouro.", callback: voltarClareira}]);
            } },
            { texto: "Sair da caverna com seu tesouro.", callback: voltarClareira }
        ]);
    }

    function procurarSuprimentos() {
        jogador.localAtual = "clareira_procurando";
        exibirNaHistoria("Você vasculha a clareira. Perto de uma grande pedra, encontra uma pequena bolsa de couro esquecida.", "narrativa");
        const sorte = Math.random();
        if (sorte < 0.7) {
            const ouroEncontrado = Math.floor(Math.random() * 10) + 5;
            exibirNaHistoria(`Dentro da bolsa, você encontra ${ouroEncontrado} moedas de ouro!`, "narrativa-positiva");
            jogador.ouro += ouroEncontrado;
            jogador.xp += 5;
            atualizarStatusPersonagem();
        } else {
            exibirNaHistoria("A bolsa está vazia, exceto por um botão velho.", "narrativa-neutra");
        }
        exibirOpcoes([
            { texto: "Voltar a observar os caminhos.", callback: voltarClareira }
        ]);
    }

    function voltarClareira() {
        jogador.localAtual = "clareira";
        exibirNaHistoria("Você está de volta à clareira inicial.", "narrativa");
        iniciarLugar();
    }

    // --- FUNÇÕES PRINCIPAIS DO JOGO ---
    function iniciarLugar() {
        jogador.localAtual = "clareira";
        exibirOpcoes([
            { texto: "Seguir a trilha para o norte, para a floresta.", callback: irParaFloresta },
            { texto: "Investigar a entrada da caverna a leste.", callback: explorarCaverna },
            { texto: "Procurar por algo útil na clareira.", callback: procurarSuprimentos }
        ]);
    }

    function iniciarJogo() {
        historiaDiv.innerHTML = '';
        exibirNaHistoria("Bem-vindo ao RPG de Texto Interativo!", "sistema-titulo");
        exibirNaHistoria(`Você é <strong>${jogador.nome}</strong>, um aventureiro de nível ${jogador.nivel}. Você acorda em uma clareira desconhecida, o sol da manhã filtrando-se pelas árvores. Uma trilha segue para o norte, embrenhando-se na floresta densa. À leste, você avista a entrada escura de uma caverna.`, "narrativa-ambiente");
        atualizarStatusPersonagem();
        iniciarLugar();
    }

    // --- PROCESSAMENTO DE COMANDO DE TEXTO ---
    enviarAcaoButton.addEventListener('click', () => {
        const comando = inputJogador.value.trim();
        if (comando) {
            exibirNaHistoria(`&gt; ${comando}`, 'acao-jogador');
            processarComando(comando);
            inputJogador.value = '';
        }
    });

    inputJogador.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            enviarAcaoButton.click();
        }
    });

    function processarComando(comando) {
        const comandoLower = comando.toLowerCase();

        // Comandos que interrompem o fluxo normal ou não precisam reexibir opções imediatamente
        if (comandoLower === "salvar") {
            salvarJogo();
            return; // Não reexibe opções, mensagem de salvar já foi dada.
        } else if (comandoLower === "carregar") {
            carregarJogo();
            return; // Não reexibe opções, carregarJogo() cuida do estado da UI.
        }


        if (comandoLower === "olhar ao redor" || comandoLower === "examinar" || comandoLower === "olhar") {
            if (jogador.localAtual === "clareira") {
                exibirNaHistoria("Você está em uma clareira ensolarada. Há uma trilha ao norte (floresta) e uma caverna a leste.", "narrativa-ambiente");
            } else if (jogador.localAtual === "floresta_inicio") {
                exibirNaHistoria("Você está no início de uma floresta densa. A trilha se bifurca para esquerda e direita.", "narrativa-ambiente");
            } else if (jogador.localAtual === "caverna_entrada") {
                exibirNaHistoria("Você está na entrada de uma caverna escura e fria.", "narrativa-ambiente");
            } else if (jogador.localAtual === "caverna_bau"){
                 exibirNaHistoria("Você está numa pequena gruta iluminada por cristais. Há um baú de madeira no centro.", "narrativa-ambiente");
            } else if (jogador.localAtual === "floresta_rio") {
                 exibirNaHistoria("Você está na margem de um rio de águas rápidas. A correnteza é forte.", "narrativa-ambiente");
            } else if (jogador.localAtual === "floresta_altar") {
                 exibirNaHistoria("Um antigo altar de pedra coberto de musgo repousa nesta parte da floresta.", "narrativa-ambiente");
            } else {
                exibirNaHistoria("Você examina seus arredores com atenção.", "narrativa-ambiente");
            }
        } else if (comandoLower === "status" || comandoLower === "personagem") {
            exibirNaHistoria(`--- STATUS ---<br>Nome: ${jogador.nome}<br>Nível: ${jogador.nivel} (XP: ${jogador.xp}/${jogador.xpParaProximoNivel})<br>PV: ${jogador.pv}/${jogador.pvMax} | PM: ${jogador.pm}/${jogador.pmMax}<br>For: ${jogador.forca} | Des: ${jogador.destreza} | Int: ${jogador.inteligencia} | Car: ${jogador.carisma}<br>Ouro: ${jogador.ouro}<br>----------------`, "sistema-info");
            atualizarStatusPersonagem();
        } else if (comandoLower === "inventario" || comandoLower === "itens" || comandoLower === "bolsa") {
            if (jogador.inventario.length > 0) {
                exibirNaHistoria(`No seu inventário: <strong>${jogador.inventario.join(", ")}</strong>.`, "sistema-info");
            } else {
                exibirNaHistoria("Seu inventário está vazio.", "sistema-info");
            }
        } else if (comandoLower === "ajuda" || comandoLower === "comandos") {
            exibirNaHistoria("Comandos úteis: <strong>olhar ao redor</strong>, <strong>status</strong>, <strong>inventario</strong>, <strong>salvar</strong>, <strong>carregar</strong>, <strong>ajuda</strong>. Use os botões para escolhas principais quando disponíveis.", "sistema-info");
        } else {
            if (opcoesDiv.children.length === 0) { // Só mostra erro se o input estiver ativo (sem botões de opção)
                 exibirNaHistoria("Não entendi o que você quis dizer, ou essa ação não é possível agora. Tente 'ajuda'.", "sistema-erro");
            } else {
                 // Se há botões de opção, talvez o jogador esteja tentando um comando inválido nesse contexto.
                 exibirNaHistoria("Use os botões para fazer sua escolha agora, ou digite um comando como 'status' ou 'ajuda'.", "sistema-aviso");
            }
        }

        // Garante que, se não houver opções de botão sendo exibidas (ou seja, o input estava ativo),
        // o input continue ativo após o processamento do comando.
        if (opcoesDiv.children.length === 0) {
            exibirOpcoes([]); // Isso efetivamente reabilita o input se ele era o modo de interação.
        }
        // Se havia botões de opção, eles permanecem, e o input permanece escondido.
    }

    // Inicia o jogo quando o DOM estiver pronto
    iniciarJogo();
});
