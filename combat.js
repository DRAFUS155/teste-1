// Lógica do Simulador de Combate

// Constantes de Escalonamento por Nível
const FATOR_PV_POR_NIVEL = 10;
const FATOR_PM_POR_NIVEL = 5;
const FATOR_ATAQUE_POR_NIVEL = 2;
const FATOR_DEFESA_POR_NIVEL = 1;

// Definição de Habilidades Globais
const TODAS_HABILIDADES = {
    "ataque_basico_fisico": new Habilidade("Ataque Físico", 0, "DANO", 5, "UNICO_INIMIGO"),
    "bola_de_fogo_pequena": new Habilidade("Bola de Fogo Pequena", 10, "DANO", 20, "UNICO_INIMIGO"),
    "rosnar_amedrontador": new Habilidade("Rosnar Amedrontador", 8, "DEBUFF", 0, "UNICO_INIMIGO"),
    "cura_regenerativa_fraca": new Habilidade("Cura Fraca", 10, "CURA", 25, "PROPRIO"),
    "flecha_perfurante": new Habilidade("Flecha Perfurante", 0, "DANO", 18, "UNICO_INIMIGO"),
    "golpe_poderoso": new Habilidade("Golpe Poderoso", 5, "DANO", 22, "UNICO_INIMIGO"),
    "escudo_protetor": new Habilidade("Escudo Protetor", 12, "BUFF", 0, "PROPRIO"),
    "lamina_venenosa": new Habilidade("Lâmina Venenosa", 8, "DANO_OVER_TIME", 5, "UNICO_INIMIGO"),
    "meditacao": new Habilidade("Meditação", 15, "RECUPERAR_PM", 20, "PROPRIO"),
    "grito_de_guerra": new Habilidade("Grito de Guerra", 10, "BUFF", 0, "ALIADOS_PROXIMOS"),
    "cegar_com_poeira": new Habilidade("Cegar com Poeira", 7, "DEBUFF", 0, "UNICO_INIMIGO")
};

// Modelos de Inimigos
const MODELOS_INIMIGOS = {
    "goblin_lanceiro": {
        nomePadrao: "Goblin Lanceiro",
        pvBaseNivel1: 30,
        pmBaseNivel1: 0,
        ataqueBaseNivel1: 8,
        defesaBaseNivel1: 2,
        habilidadesIds: ["ataque_basico_fisico"]
    },
    "goblin_shaman": {
        nomePadrao: "Goblin Shaman",
        pvBaseNivel1: 25,
        pmBaseNivel1: 20,
        ataqueBaseNivel1: 5,
        defesaBaseNivel1: 1,
        habilidadesIds: ["bola_de_fogo_pequena", "rosnar_amedrontador"]
    },
    "lobo_das_cavernas": {
        nomePadrao: "Lobo das Cavernas",
        pvBaseNivel1: 45,
        pmBaseNivel1: 5,
        ataqueBaseNivel1: 12,
        defesaBaseNivel1: 4,
        habilidadesIds: ["ataque_basico_fisico", "rosnar_amedrontador"]
    }
};

const RACAS_JOGADOR = {
    "humano": {
        nome: "Humano",
        modificadores: { pvBase: 5, pmBase: 5, ataqueBase: 1, defesaBase: 1 },
        habilidadesIniciaisIds: ["ataque_basico_fisico"]
    },
    "elfo": {
        nome: "Elfo",
        modificadores: { pvBase: -5, pmBase: 15, ataqueBase: 0, defesaBase: 0 },
        habilidadesIniciaisIds: ["bola_de_fogo_pequena", "ataque_basico_fisico"]
    },
    "anao": {
        nome: "Anão",
        modificadores: { pvBase: 15, pmBase: -5, ataqueBase: 2, defesaBase: 3 },
        habilidadesIniciaisIds: ["golpe_poderoso", "ataque_basico_fisico"]
    },
    "halfling": {
        nome: "Halfling",
        modificadores: { pvBase: -10, pmBase: 0, ataqueBase: -1, defesaBase: 0 },
        habilidadesIniciaisIds: ["cegar_com_poeira", "ataque_basico_fisico"]
    }
};

const CLASSES_JOGADOR = {
    "guerreiro": {
        nome: "Guerreiro",
        pvBaseNivel1: 120,
        pmBaseNivel1: 30,
        ataqueBaseNivel1: 15,
        defesaBaseNivel1: 10,
        habilidadesIniciaisIds: ["golpe_poderoso", "grito_de_guerra"]
    },
    "mago": {
        nome: "Mago",
        pvBaseNivel1: 80,
        pmBaseNivel1: 70,
        ataqueBaseNivel1: 5,
        defesaBaseNivel1: 5,
        habilidadesIniciaisIds: ["bola_de_fogo_pequena", "escudo_protetor", "meditacao"]
    },
    "arqueiro": {
        nome: "Arqueiro",
        pvBaseNivel1: 100,
        pmBaseNivel1: 40,
        ataqueBaseNivel1: 12,
        defesaBaseNivel1: 7,
        habilidadesIniciaisIds: ["flecha_perfurante"]
    },
    "ladino": {
        nome: "Ladino",
        pvBaseNivel1: 90,
        pmBaseNivel1: 50,
        ataqueBaseNivel1: 10,
        defesaBaseNivel1: 6,
        habilidadesIniciaisIds: ["lamina_venenosa", "cegar_com_poeira"]
    }
};

let inimigosEmCombate = [];
let jogador = null;
let habilidadeSelecionadaPeloJogador = null;

class Personagem {
    constructor(nome, nivel, pvBaseNivel1, pmBaseNivel1, ataqueBaseNivel1, defesaBaseNivel1) {
        this.nome = nome;
        this.nivel = nivel > 0 ? nivel : 1;
        this.pvBase = pvBaseNivel1;
        this.pmBase = pmBaseNivel1;
        this.ataqueBaseOriginal = ataqueBaseNivel1;
        this.defesaBaseOriginal = defesaBaseNivel1;
        this.pvMaximos = 0;
        this.pmMaximos = 0;
        this.ataqueBase = 0;
        this.defesaBase = 0;
        this.aplicarEscalonamentoPorNivel();
        this.buffs = [];
        this.debuffs = [];
        this.habilidades = [];
    }

    aplicarEscalonamentoPorNivel() {
        if (this.nivel <= 0) this.nivel = 1;
        this.pvMaximos = Math.max(1, this.pvBase + (this.nivel - 1) * FATOR_PV_POR_NIVEL);
        this.pmMaximos = Math.max(0, this.pmBase + (this.nivel - 1) * FATOR_PM_POR_NIVEL);
        this.ataqueBase = this.ataqueBaseOriginal + (this.nivel - 1) * FATOR_ATAQUE_POR_NIVEL;
        this.defesaBase = this.defesaBaseOriginal + (this.nivel - 1) * FATOR_DEFESA_POR_NIVEL;
        this.pvAtuais = this.pvMaximos;
        this.pmAtuais = this.pmMaximos;
    }

    receberDano(quantidade) {
        this.pvAtuais -= quantidade;
        if (this.pvAtuais < 0) this.pvAtuais = 0;
    }

    curar(quantidade) {
        this.pvAtuais += quantidade;
        if (this.pvAtuais > this.pvMaximos) this.pvAtuais = this.pvMaximos;
    }

    estaVivo() { return this.pvAtuais > 0; }

    gastarPM(custo) {
        if (this.pmAtuais >= custo) {
            this.pmAtuais -= custo;
            return true;
        }
        return false;
    }

    aprenderHabilidade(habilidade) {
        if (habilidade instanceof Habilidade && !this.habilidades.some(h => h.nome === habilidade.nome)) {
            this.habilidades.push(habilidade);
        } else if (!(habilidade instanceof Habilidade)) {
            console.error("Tentativa de adicionar algo que não é uma Habilidade.");
        }
    }

    get ataqueCalculado() {
        let ataqueFinal = this.ataqueBase;
        this.buffs.forEach(b => { if (b.atributoMod === 'ataqueBase') ataqueFinal += b.valorMod; });
        this.debuffs.forEach(d => { if (d.atributoMod === 'ataqueBase') ataqueFinal += d.valorMod; });
        return Math.max(0, ataqueFinal);
    }

    get defesaCalculada() {
        let defesaFinal = this.defesaBase;
        this.buffs.forEach(b => { if (b.atributoMod === 'defesaBase') defesaFinal += b.valorMod; });
        this.debuffs.forEach(d => { if (d.atributoMod === 'defesaBase') defesaFinal += d.valorMod; });
        return Math.max(0, defesaFinal);
    }

    processarEfeitosDeTurno() {
        const debuffsAtivos = [];
        for (const d of this.debuffs) {
            if (d.tipo === 'DANO_OVER_TIME' && d.danoPorTurno > 0) {
                combatManager.log(`${this.nome} sofre ${d.danoPorTurno} de dano de ${d.nome}. PV: ${Math.max(0,this.pvAtuais - d.danoPorTurno)}/${this.pvMaximos}`);
                this.receberDano(d.danoPorTurno);
            }
            d.duracao--;
            if (d.duracao > 0 && this.estaVivo()) debuffsAtivos.push(d);
            else combatManager.log(`${d.nome} terminou seu efeito em ${this.nome}.`);
        }
        this.debuffs = debuffsAtivos;

        const buffsAtivos = [];
        for (const b of this.buffs) {
            b.duracao--;
            if (b.duracao > 0) buffsAtivos.push(b);
            else combatManager.log(`${b.nome} terminou seu efeito em ${this.nome}.`);
        }
        this.buffs = buffsAtivos;
    }
}

class Habilidade {
    constructor(nome, custo, tipo, valorBase, alvo = 'UNICO_INIMIGO') {
        this.nome = nome;
        this.custo = custo;
        this.tipo = tipo.toUpperCase();
        this.valorBase = valorBase;
        this.alvo = alvo.toUpperCase();
    }

    usar(usuario, alvos) {
        if (this.custo > 0 && !usuario.gastarPM(this.custo)) {
            combatManager.log(`${usuario.nome} não tem PM/PE (${usuario.pmAtuais}) suficiente para ${this.nome} (custo: ${this.custo}).`);
            return false;
        }

        const alvosArray = Array.isArray(alvos) ? alvos : [alvos];
        let sucesso = false;

        alvosArray.forEach(alvo => {
            if (!alvo || !alvo.estaVivo()) {
                combatManager.log(`${alvo ? alvo.nome : 'Alvo'} não pode ser afetado (morto ou inválido).`);
                return;
            }
            let danoCalculado, cura;
            switch (this.tipo) {
                case 'DANO':
                    danoCalculado = this.valorBase + (usuario.ataqueCalculado || usuario.ataqueBase) - (alvo.defesaCalculada || alvo.defesaBase);
                    danoCalculado = Math.max(1, danoCalculado);
                    combatManager.log(`${this.nome} de ${usuario.nome} causa ${danoCalculado} de dano em ${alvo.nome}. PV restantes: ${Math.max(0,alvo.pvAtuais - danoCalculado)}/${alvo.pvMaximos}`);
                    alvo.receberDano(danoCalculado);
                    sucesso = true;
                    break;
                case 'CURA':
                    cura = this.valorBase;
                    combatManager.log(`${this.nome} de ${usuario.nome} cura ${cura} PV para ${alvo.nome}. PV atuais: ${Math.min(alvo.pvMaximos, alvo.pvAtuais + cura)}/${alvo.pvMaximos}`);
                    alvo.curar(cura);
                    sucesso = true;
                    break;
                case 'BUFF':
                    alvo.buffs.push({ nome: this.nome, duracao: 3, atributoMod: 'ataqueBase', valorMod: 5 });
                    combatManager.log(`${this.nome} de ${usuario.nome} aplicou um buff em ${alvo.nome} (+5 Ataque por 3 turnos).`);
                    sucesso = true;
                    break;
                case 'DEBUFF':
                    alvo.debuffs.push({ nome: this.nome, duracao: 3, atributoMod: 'defesaBase', valorMod: -3 });
                    combatManager.log(`${this.nome} de ${usuario.nome} aplicou um debuff em ${alvo.nome} (-3 Defesa por 3 turnos).`);
                    sucesso = true;
                    break;
                case 'DANO_OVER_TIME':
                    alvo.debuffs.push({ nome: this.nome, duracao: 3, tipo: 'DANO_OVER_TIME', danoPorTurno: this.valorBase });
                    combatManager.log(`${this.nome} de ${usuario.nome} aplicou dano contínuo (${this.valorBase}/turno) em ${alvo.nome} por 3 turnos.`);
                    sucesso = true;
                    break;
                case 'RECUPERAR_PM':
                    const pmAntes = usuario.pmAtuais;
                    usuario.pmAtuais = Math.min(usuario.pmMaximos, usuario.pmAtuais + this.valorBase);
                    combatManager.log(`${usuario.nome} usou ${this.nome} e recuperou ${usuario.pmAtuais - pmAntes} de PM/PE. PM atuais: ${usuario.pmAtuais}/${usuario.pmMaximos}`);
                    sucesso = true;
                    break;
                default:
                    combatManager.log(`Tipo de habilidade '${this.tipo}' ainda não implementado ou desconhecido para ${this.nome}.`);
            }
        });
        return sucesso;
    }
}

function criarInstanciaInimigo(idModelo, nivel, nomeEspecifico = null) {
    const modelo = MODELOS_INIMIGOS[idModelo];
    if (!modelo) { console.error(`Modelo "${idModelo}" não encontrado.`); return null; }
    const nome = nomeEspecifico || modelo.nomePadrao;
    const inimigo = new Personagem(nome, nivel, modelo.pvBaseNivel1, modelo.pmBaseNivel1, modelo.ataqueBaseNivel1, modelo.defesaBaseNivel1);
    if (modelo.habilidadesIds) {
        modelo.habilidadesIds.forEach(idHab => {
            const hab = TODAS_HABILIDADES[idHab];
            if (hab) inimigo.aprenderHabilidade(hab);
            else console.warn(`Hab ID "${idHab}" não encontrada para modelo "${idModelo}".`);
        });
    }
    return inimigo;
}

function criarOuAtualizarJogador(nomeJogador, idRaca, idClasse, nivel) {
    const raca = RACAS_JOGADOR[idRaca];
    const classe = CLASSES_JOGADOR[idClasse];
    if (!raca || !classe) { console.error("Raça ou Classe não encontrada."); return null; }

    let pvBase = classe.pvBaseNivel1 + (raca.modificadores.pvBase || 0);
    let pmBase = classe.pmBaseNivel1 + (raca.modificadores.pmBase || 0);
    let ataqueBase = classe.ataqueBaseNivel1 + (raca.modificadores.ataqueBase || 0);
    let defesaBase = classe.defesaBaseNivel1 + (raca.modificadores.defesaBase || 0);

    jogador = new Personagem(nomeJogador, nivel, pvBase, pmBase, ataqueBase, defesaBase);

    if (raca.habilidadesIniciaisIds) raca.habilidadesIniciaisIds.forEach(id => { if(TODAS_HABILIDADES[id]) jogador.aprenderHabilidade(TODAS_HABILIDADES[id]); });
    if (classe.habilidadesIniciaisIds) classe.habilidadesIniciaisIds.forEach(id => { if(TODAS_HABILIDADES[id]) jogador.aprenderHabilidade(TODAS_HABILIDADES[id]); });

    console.log(`Jogador: ${jogador.nome}, Raça: ${raca.nome}, Classe: ${classe.nome}, Nv: ${jogador.nivel}`);
    console.log(`PV: ${jogador.pvAtuais}/${jogador.pvMaximos}, PM: ${jogador.pmAtuais}/${jogador.pmMaximos}, Atk: ${jogador.ataqueBase}, Def: ${jogador.defesaBase}`);
    console.log("Habilidades:", jogador.habilidades.map(h => h.nome).join(', ') || 'Nenhuma');
    return jogador;
}

class CombatManager {
    constructor() {
        this.combatentes = []; this.turnoAtual = 0; this.jogador = null; this.inimigos = [];
        this.logCombateUI = document.getElementById('log-combate'); this.combateAtivo = false;
    }

    log(msg) { console.log(msg); if (this.logCombateUI) { const p = document.createElement('p'); p.textContent = msg; this.logCombateUI.appendChild(p); this.logCombateUI.scrollTop = this.logCombateUI.scrollHeight; } }

    iniciarCombate(jogadorInstance, inimigosArray) {
        if (!jogadorInstance || inimigosArray.length === 0) { this.log("Erro: Jogador ou inimigos não fornecidos."); return; }
        this.combateAtivo = true; this.jogador = jogadorInstance; this.inimigos = [...inimigosArray];
        this.combatentes = [this.jogador, ...this.inimigos.filter(i => i.estaVivo())]; this.turnoAtual = 0;
        if (this.logCombateUI) this.logCombateUI.innerHTML = '';
        this.log(`--- Combate Iniciado! ---`);
        this.log(`${this.jogador.nome} (PV: ${this.jogador.pvAtuais}/${this.jogador.pvMaximos}) enfrenta ${this.inimigos.map(i => `${i.nome} (PV: ${i.pvAtuais}/${i.pvMaximos})`).join(', ')}.`);
        this.proximoTurno();
    }

    proximoTurno() {
        if (!this.combateAtivo) return;
        atualizarInfoJogadorUI(); atualizarInfoInimigosUI();

        this.combatentes = this.combatentes.filter(c => c.estaVivo());
        if (this.combatentes.length === 0) { this.encerrarCombate("EMPATE_INESPERADO"); return; }

        const condVitoria = this.verificarFimDeCombate();
        if (condVitoria) { this.encerrarCombate(condVitoria); return; }

        this.turnoAtual %= this.combatentes.length;
        const combatenteAtual = this.combatentes[this.turnoAtual];
        combatenteAtual.processarEfeitosDeTurno();
        atualizarInfoJogadorUI(); atualizarInfoInimigosUI();

        if (!combatenteAtual.estaVivo()) {
            this.log(`${combatenteAtual.nome} sucumbiu a efeitos!`);
            this.proximoTurno(); return;
        }

        this.log(`--- Turno de ${combatenteAtual.nome} (PV: ${combatenteAtual.pvAtuais}/${combatenteAtual.pvMaximos}, PM: ${combatenteAtual.pmAtuais}/${combatenteAtual.pmMaximos}) ---`);

        if (combatenteAtual === this.jogador) {
            this.log("É o turno do jogador. Escolha sua ação.");
            popularAcoesJogadorUI();
        } else {
            document.getElementById('acoesDisponiveis').innerHTML = `<p>Turno de ${combatenteAtual.nome}...</p>`;
            document.getElementById('botaoConfirmarAcao').disabled = true;
            habilidadeSelecionadaPeloJogador = null;
            setTimeout(() => this.executarAcaoInimigo(combatenteAtual), 1000);
        }
    }

    executarAcaoInimigo(inimigo) {
        if (!this.combateAtivo || !inimigo.estaVivo()) return;
        const alvo = this.jogador; let acaoFeita = false;
        if (alvo && alvo.estaVivo()) {
            const habsDano = inimigo.habilidades.filter(h => inimigo.pmAtuais >= h.custo && h.tipo === "DANO");
            if (habsDano.length > 0) {
                const hab = habsDano[Math.floor(Math.random() * habsDano.length)];
                this.log(`${inimigo.nome} usa ${hab.nome} em ${alvo.nome}!`);
                hab.usar(inimigo, alvo); acaoFeita = true;
            }
            if (!acaoFeita) {
                const atkBasico = inimigo.habilidades.find(h => h.nome.toLowerCase().includes("ataque físico")) || TODAS_HABILIDADES["ataque_basico_fisico"];
                if (atkBasico && inimigo.pmAtuais >= atkBasico.custo) {
                    this.log(`${inimigo.nome} usa ${atkBasico.nome} em ${alvo.nome}!`);
                    atkBasico.usar(inimigo, alvo); acaoFeita = true;
                } else this.log(`${inimigo.nome} não tem ação válida.`);
            }
        } else this.log(`${inimigo.nome} não tem alvos.`);

        atualizarInfoJogadorUI(); atualizarInfoInimigosUI();
        if (this.combateAtivo) { this.turnoAtual = (this.turnoAtual + 1) % this.combatentes.length; setTimeout(() => this.proximoTurno(), 1000); }
    }

    verificarFimDeCombate() {
        if (this.jogador && !this.jogador.estaVivo()) return "DERROTA";
        if (this.inimigos.every(i => !i.estaVivo())) return "VITORIA";
        return null;
    }

    encerrarCombate(resultado) {
        this.combateAtivo = false;
        atualizarInfoJogadorUI();
        atualizarInfoInimigosUI();
        document.getElementById('acoesDisponiveis').innerHTML = '<p>Combate encerrado.</p>';
        document.getElementById('botaoConfirmarAcao').disabled = true;
        habilidadeSelecionadaPeloJogador = null;

        if (resultado === "VITORIA") this.log("🎉 Todos os inimigos foram derrotados! Você VENCEU! 🎉");
        else if (resultado === "DERROTA") this.log("☠️ Você foi derrotado... Game Over. ☠️");
        else if (resultado === "FUGA") this.log("💨 Você conseguiu fugir do combate!");
        else this.log("Combate encerrado.");

        const btnAdd = document.getElementById('botaoAdicionarInimigo'); if(btnAdd) btnAdd.disabled = false;
        const btnStart = document.getElementById('botaoIniciarCombate'); if(btnStart) btnStart.disabled = false;
    }

    jogadorRealizarAcao(alvo, habilidade) {
        if (!this.combateAtivo || this.combatentes[this.turnoAtual] !== this.jogador || !this.jogador.estaVivo()) { this.log("Ação inválida agora."); return; }
        if (!alvo || !alvo.estaVivo()) { this.log("Alvo inválido."); return; }
        if (!habilidade) { this.log("Habilidade não selecionada."); return; }

        this.log(`${this.jogador.nome} usa ${habilidade.nome} em ${alvo.nome}!`);
        const sucesso = habilidade.usar(this.jogador, alvo);

        atualizarInfoJogadorUI(); atualizarInfoInimigosUI();

        if (this.combateAtivo && sucesso) { this.turnoAtual = (this.turnoAtual + 1) % this.combatentes.length; setTimeout(() => this.proximoTurno(), 1000); }
        else if (!sucesso) { this.log("Ação falhou. Tente outra."); popularAcoesJogadorUI(); }
    }

    jogadorTentarFugir() {
        if (!this.combateAtivo || this.combatentes[this.turnoAtual] !== this.jogador) {
            this.log("Não é possível fugir agora.");
            return;
        }

        this.log(`${this.jogador.nome} tenta fugir do combate!`);
        const chanceDeFuga = 0.5;
        if (Math.random() < chanceDeFuga) {
            this.log("Fuga bem-sucedida!");
            this.encerrarCombate("FUGA");
        } else {
            this.log("A fuga falhou!");
            this.turnoAtual = (this.turnoAtual + 1) % this.combatentes.length;
            setTimeout(() => this.proximoTurno(), 1000);
        }
        document.getElementById('acoesDisponiveis').innerHTML = '<p>Tentando fugir...</p>';
        document.getElementById('botaoConfirmarAcao').disabled = true;
        habilidadeSelecionadaPeloJogador = null;
    }

    jogadorTentarNegociar() {
        if (!this.combateAtivo || this.combatentes[this.turnoAtual] !== this.jogador) {
            this.log("Não é possível negociar agora.");
            return;
        }

        this.log(`${this.jogador.nome} tenta negociar com os inimigos...`);
        this.log("A negociação ainda não foi implementada.");
        this.log("A negociação falhou (não implementada).");
        this.turnoAtual = (this.turnoAtual + 1) % this.combatentes.length;
        setTimeout(() => this.proximoTurno(), 1000);

        document.getElementById('acoesDisponiveis').innerHTML = '<p>Tentando negociar...</p>';
        document.getElementById('botaoConfirmarAcao').disabled = true;
        habilidadeSelecionadaPeloJogador = null;
    }
}

const combatManager = new CombatManager();

function atualizarInfoJogadorUI() {
    if (!jogador) return;
    document.getElementById('jogadorNome').textContent = jogador.nome;
    document.getElementById('jogadorPV').textContent = `${jogador.pvAtuais}/${jogador.pvMaximos}`;
    document.getElementById('jogadorPM').textContent = `${jogador.pmAtuais}/${jogador.pmMaximos}`;
    document.getElementById('jogadorBuffs').textContent = jogador.buffs.map(b => `${b.nome}(${b.duracao}t)`).join(', ') || "Nenhum";
    document.getElementById('jogadorDebuffs').textContent = jogador.debuffs.map(d => `${d.nome}(${d.duracao}t)`).join(', ') || "Nenhum";
}

function atualizarInfoInimigosUI() {
    const container = document.getElementById('containerListaInimigos');
    if (!container) return;
    container.innerHTML = '';
    combatManager.inimigos.forEach((inimigo, index) => {
        if (!inimigo) return;
        const divInimigo = document.createElement('div');
        divInimigo.className = 'inimigo-info' + (!inimigo.estaVivo() ? ' derrotado' : '');
        divInimigo.innerHTML = `
            <p><strong>${inimigo.nome} (Nível ${inimigo.nivel}) ${!inimigo.estaVivo() ? "- DERROTADO" : ""}</strong></p>
            <p>PV: ${inimigo.pvAtuais}/${inimigo.pvMaximos}</p>
            <p>Buffs: ${inimigo.buffs.map(b => `${b.nome}(${b.duracao}t)`).join(', ') || "Nenhum"}</p>
            <p>Debuffs: ${inimigo.debuffs.map(d => `${d.nome}(${d.duracao}t)`).join(', ') || "Nenhum"}</p>`;
        divInimigo.dataset.inimigoId = index;
        container.appendChild(divInimigo);
    });
}

function popularAcoesJogadorUI() {
    const contAcoes = document.getElementById('acoesDisponiveis');
    const selAlvo = document.getElementById('selectAlvo');
    const btnConfirmar = document.getElementById('botaoConfirmarAcao');

    if (!contAcoes || !selAlvo || !jogador || !combatManager.combateAtivo || combatManager.combatentes.length === 0 || combatManager.combatentes[combatManager.turnoAtual] !== jogador) {
        if (contAcoes) contAcoes.innerHTML = '<p>Aguardando seu turno...</p>';
        if (selAlvo) selAlvo.innerHTML = '';
        if (btnConfirmar) btnConfirmar.disabled = true;
        habilidadeSelecionadaPeloJogador = null;
        return;
    }
    contAcoes.innerHTML = '';

    const ataqueBasico = jogador.habilidades.find(h => h.nome.toLowerCase().includes("ataque físico"));
    if (ataqueBasico) {
        const btn = document.createElement('button'); btn.textContent = ataqueBasico.nome;
        btn.onclick = () => selecionarHabilidade(ataqueBasico); contAcoes.appendChild(btn);
    }
    jogador.habilidades.forEach(h => {
        if (h === ataqueBasico) return;
        const btn = document.createElement('button'); btn.textContent = `${h.nome} (${h.custo} PM)`;
        btn.disabled = jogador.pmAtuais < h.custo;
        btn.onclick = () => selecionarHabilidade(h); contAcoes.appendChild(btn);
    });

    const btnFugir = document.createElement('button');
    btnFugir.textContent = "Tentar Fugir";
    btnFugir.id = "btnFugir";
    btnFugir.onclick = () => {
        combatManager.jogadorTentarFugir();
    };
    contAcoes.appendChild(btnFugir);

    const btnNegociar = document.createElement('button');
    btnNegociar.textContent = "Tentar Negociar";
    btnNegociar.id = "btnNegociar";
    btnNegociar.onclick = () => {
        combatManager.jogadorTentarNegociar();
    };
    contAcoes.appendChild(btnNegociar);

    selAlvo.innerHTML = '';
    combatManager.inimigos.forEach((inimigo, index) => {
        if (inimigo.estaVivo()) {
            const opt = document.createElement('option'); opt.value = index; // Usar o índice original do array combatManager.inimigos
            opt.textContent = `${inimigo.nome} (PV: ${inimigo.pvAtuais})`; selAlvo.appendChild(opt);
        }
    });
    // Só habilita o botão de confirmar se uma habilidade que precisa de alvo for selecionada
    // e se houver alvos. Fuga e Negociação são imediatas.
    btnConfirmar.disabled = !habilidadeSelecionadaPeloJogador || selAlvo.options.length === 0;
}

function selecionarHabilidade(habilidade) {
    habilidadeSelecionadaPeloJogador = habilidade;
    combatManager.log(`Habilidade selecionada: ${habilidade.nome}. Escolha um alvo e confirme.`);
    document.getElementById('botaoConfirmarAcao').disabled = document.getElementById('selectAlvo').options.length === 0;
    document.querySelectorAll('#acoesDisponiveis button').forEach(btn => {
        // Verifica se o texto do botão corresponde ao nome da habilidade, ignorando o custo de PM
        const btnTextNome = btn.textContent.split(' (')[0];
        btn.style.border = btnTextNome === habilidade.nome ? "2px solid blue" : "";
    });
}

function popularSelectModelosInimigos() {
    const select = document.getElementById('selectModeloInimigo');
    if (!select) return;
    select.innerHTML = '';
    for (const idModelo in MODELOS_INIMIGOS) {
        if (MODELOS_INIMIGOS.hasOwnProperty(idModelo)) {
            const modelo = MODELOS_INIMIGOS[idModelo];
            const option = document.createElement('option');
            option.value = idModelo;
            option.textContent = modelo.nomePadrao || idModelo;
            select.appendChild(option);
        }
    }
}

function atualizarListaInimigosSetupUI() {
    const listaUI = document.getElementById('listaInimigosCombate');
    if (!listaUI) return;
    listaUI.innerHTML = '';
    inimigosEmCombate.forEach((inimigo, index) => {
        const listItem = document.createElement('li');
        let textoInimigo = `[${index}] ${inimigo.nome} (Nível ${inimigo.nivel}) - PV: ${inimigo.pvAtuais}/${inimigo.pvMaximos}`;
        listItem.textContent = textoInimigo;
        listaUI.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    if (!jogador) {
        criarOuAtualizarJogador("Tester", "humano", "guerreiro", 1);
    }
    atualizarInfoJogadorUI();
    popularSelectModelosInimigos();
    atualizarListaInimigosSetupUI();

    const btnAddInimigo = document.getElementById('botaoAdicionarInimigo');
    if (btnAddInimigo) {
        btnAddInimigo.addEventListener('click', () => {
            const idModelo = document.getElementById('selectModeloInimigo').value;
            const nivel = parseInt(document.getElementById('inputNivelInimigo').value, 10);
            const nomeEsp = document.getElementById('inputNomeInimigo').value.trim();
            if (!idModelo || isNaN(nivel) || nivel <= 0) { alert("Seleção ou Nível inválido."); return; }
            const novoInimigo = criarInstanciaInimigo(idModelo, nivel, nomeEsp || null);
            if (novoInimigo) {
                inimigosEmCombate.push(novoInimigo);
                atualizarListaInimigosSetupUI();
                document.getElementById('inputNomeInimigo').value = '';
                combatManager.log(`Inimigo ${novoInimigo.nome} (Nvl ${novoInimigo.nivel}) adicionado à espera.`);
            } else alert("Falha ao criar inimigo.");
        });
    }

    const btnIniciarCombate = document.getElementById('botaoIniciarCombate');
    if (btnIniciarCombate) {
        btnIniciarCombate.addEventListener('click', () => {
            if (!jogador) { alert("Crie o jogador primeiro!"); return; }
            if (inimigosEmCombate.length === 0) { alert("Adicione inimigos!"); return; }

            if(btnAddInimigo) btnAddInimigo.disabled = true;
            btnIniciarCombate.disabled = true;
            combatManager.iniciarCombate(jogador, inimigosEmCombate);
        });
    }

    const btnConfirmarAcao = document.getElementById('botaoConfirmarAcao');
    if (btnConfirmarAcao) {
        btnConfirmarAcao.addEventListener('click', () => {
            if (!habilidadeSelecionadaPeloJogador) { alert("Nenhuma habilidade selecionada!"); return; }
            const selAlvo = document.getElementById('selectAlvo');
            if (selAlvo.options.length === 0) { alert("Nenhum alvo disponível!"); popularAcoesJogadorUI(); return; }

            const indiceAlvoNoSelect = parseInt(selAlvo.value, 10); // Este é o índice no array de inimigos do CombatManager
            const alvoSelecionado = combatManager.inimigos[indiceAlvoNoSelect];

            if (alvoSelecionado && alvoSelecionado.estaVivo()) {
                combatManager.jogadorRealizarAcao(alvoSelecionado, habilidadeSelecionadaPeloJogador);
                document.getElementById('acoesDisponiveis').innerHTML = '<p>Aguardando...</p>';
                btnConfirmarAcao.disabled = true;
                habilidadeSelecionadaPeloJogador = null;
                document.querySelectorAll('#acoesDisponiveis button').forEach(btn => btn.style.border = "");
            } else {
                alert("Alvo inválido ou já derrotado. Atualizando lista de alvos...");
                popularAcoesJogadorUI();
            }
        });
    }
});

console.log("Opções de Fuga e Negociação adicionadas (placeholders).");
