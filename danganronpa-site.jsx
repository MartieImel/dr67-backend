import { useState, useEffect, useCallback, useRef } from "react";

// ══════════════════════════════════════════════════════════
//  STYLES & FONTS
// ══════════════════════════════════════════════════════════
const injectStyles = () => {
  if (document.getElementById("dng-s")) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=VT323&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.id = "dng-s";
  s.textContent = `
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#08080f!important;color:#f0ede8;overflow-x:hidden;}
    ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#08080f;}::-webkit-scrollbar-thumb{background:#c41e3a;border-radius:2px;}
    @keyframes flicker{0%,100%{opacity:1}48%{opacity:1}50%{opacity:.6}52%{opacity:1}73%{opacity:.9}75%{opacity:1}}
    @keyframes glitch{0%,85%,100%{clip-path:none;transform:none}86%{clip-path:inset(10% 0 85% 0);transform:translate(-3px)}88%{clip-path:inset(60% 0 30% 0);transform:translate(3px,-2px)}90%{clip-path:none;transform:none}}
    @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes fadeOut{from{opacity:1}to{opacity:0}}
    @keyframes pulseRed{0%,100%{box-shadow:0 0 6px #c41e3a20}50%{box-shadow:0 0 22px #c41e3a60}}
    @keyframes scanline{0%{top:-4px}100%{top:100%}}
    @keyframes hopePulse{0%,100%{opacity:.7}50%{opacity:1}}
    @keyframes crtExpand{0%{transform:scaleY(0.01) scaleX(1);opacity:1}30%{transform:scaleY(0.01) scaleX(1)}60%{transform:scaleY(1) scaleX(1.01)}80%{transform:scaleY(1) scaleX(1.01)}100%{transform:scaleY(1) scaleX(1)}}
    @keyframes crtCollapse{0%{transform:scaleY(1);opacity:1}40%{transform:scaleY(0.02) scaleX(1.04);opacity:1}60%{transform:scaleY(0.02) scaleX(0);opacity:.6}100%{transform:scaleY(0) scaleX(0);opacity:0}}
    @keyframes staticNoise{0%{background-position:0 0}10%{background-position:-5% -10%}20%{background-position:-15% 5%}30%{background-position:7% -25%}40%{background-position:20% 25%}50%{background-position:-25% 10%}60%{background-position:15% 5%}70%{background-position:0% 15%}80%{background-position:25% 35%}90%{background-position:-10% 10%}100%{background-position:0 0}}
    @keyframes scanSweep{0%{top:-8px;opacity:1}100%{top:110%;opacity:.4}}
    @keyframes typewriter{from{width:0}to{width:100%}}
    @keyframes charLoad{0%{opacity:0;transform:translateY(30px) scale(.9)}60%{opacity:1;transform:translateY(-4px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes bootFlash{0%{opacity:0}50%{opacity:.3}100%{opacity:0}}
    @keyframes screenOn{0%{filter:brightness(3) blur(8px);opacity:0}40%{filter:brightness(2) blur(2px);opacity:1}70%{filter:brightness(1.3) blur(0px)}100%{filter:brightness(1) blur(0)}}
    .flicker{animation:flicker 5s infinite;}
    .glitch{animation:glitch 8s infinite;}
    .slide{animation:slideUp .3s ease-out;}
    .fade{animation:fadeIn .4s ease;}
    .pulse{animation:pulseRed 2.5s infinite;}
    .title{font-family:'Bebas Neue',sans-serif!important;letter-spacing:3px;}
    .pixel{font-family:'VT323',monospace!important;}
    .type{font-family:'Courier Prime',monospace!important;}
    input,textarea,select{font-family:'Courier Prime',monospace!important;background:#10101e!important;color:#f0ede8!important;border:1px solid #2a2a3e!important;border-radius:2px!important;padding:6px 10px!important;}
    input:focus,textarea:focus{border-color:#c41e3a!important;outline:none!important;box-shadow:0 0 10px #c41e3a25!important;}
    button{font-family:'Courier Prime',monospace!important;cursor:pointer;}
    button:hover{opacity:.85;}
    table{border-collapse:collapse;width:100%;}
    th{background:#12121e;color:#c41e3a;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:7px 10px;text-align:left;border-bottom:1px solid #2a2a3e;}
    td{padding:6px 10px;border-bottom:1px solid #1a1a28;font-size:12px;vertical-align:middle;}
    tr:hover td{background:#141426;}
    .scrollbar-hide::-webkit-scrollbar{display:none;}
    .scanline-overlay{pointer-events:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9998;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);}
    .crt-screen{animation:crtExpand .55s cubic-bezier(.22,1,.36,1) forwards;}
    .crt-off{animation:crtCollapse .45s ease-in forwards;}
    .screen-on{animation:screenOn .8s ease-out forwards;}
    .static-bg{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");background-size:128px;animation:staticNoise .08s steps(1) infinite;}
  `;
  document.head.appendChild(s);
};

// Map of lock codes por personagem — sobreescreva se quiser códigos customizados
// LOCK_CODES: códigos de recuperação por personagem (personalize se quiser)
// (defined after CHARS so CHARS exists)


// ══════════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════════
const T = {
  bg:"#08080f", s1:"#0d0d1a", s2:"#121220", s3:"#1a1a2a", s4:"#202032",
  bd:"#242438", bd2:"#32324c",
  red:"#c41e3a", redL:"#e0304e", redD:"#7a1225",
  yellow:"#f5c518", yellowD:"#c49a00",
  white:"#f0ede8", muted:"#8888a8", dim:"#505068",
  green:"#28883e", greenL:"#3dba60",
  blue:"#2060a8", purple:"#6028a8",
};

const ROLE_BADGE = {
  player: {bg:"#0e1e30", text:"#4d8fca", label:"JOGADOR"},
};

const STATUS_COLOR = { vivo:T.greenL, ferido:"#f5a020", morto:T.muted, executado:T.red };
const CLUE_COLORS = { fisica:"#2060a8", temporal:"#c4a010", testemunhal:"#207840", emocional:"#a02060", falsa:"#404040" };
const CLUE_LABELS = { fisica:"🔵 Física", temporal:"🟡 Temporal", testemunhal:"🟢 Testemunhal", emocional:"🔴 Emocional", falsa:"⚫ Falsa" };

// ══════════════════════════════════════════════════════════
//  DERIVED STATS
// ══════════════════════════════════════════════════════════
const derive = (a) => ({
  pvMax: a.RES*3+10,
  psMax: a.ESP*3+10,
  init:  a.INT+a.SOR,
  def:   Math.floor(a.RES/2),
  coinsMax: a.SOR*5,
});

// ══════════════════════════════════════════════════════════
//  CHARACTERS — TURMA 67
// ══════════════════════════════════════════════════════════
const CHARS = [
  {
    id:1, num:"#01", pw:"haruki", role:"player", type:"Jogador",
    name:"Haruki Shimada", talent:"Supremo Arquiteto de Paisagens Impossíveis",
    age:17, pro:"Ele/Dele",
    appear:"Alto, cabelos castanhos lisos e óculos redondos. Veste-se de forma metódica, sempre com o mesmo suéter azul escuro. Expressão permanentemente calma. Carrega um caderno de esboços onde desenha saídas e plantas de todo lugar que entra.",
    attrs:{ESP:10,INT:14,FUR:8,PER:9,RES:10,SOR:9},
    ability:{name:"Leitura Espacial",desc:"Uma vez por sessão, pode identificar automaticamente uma saída oculta, passagem secreta ou ponto cego de câmera em qualquer ambiente. Sem necessidade de Teste."},
    weakness:"Visão de Planta — Enxerga as pessoas como elementos de um sistema, não como indivíduos. −2 em PER para demonstrar empatia genuína em cenas de comoção.",
    bonds:[{name:"Izumi Hana",lvl:1},{name:"Tetsuya Mori",lvl:1}],
    motivation:"Encontrar uma saída física do edifício. Já analisou 3 rotas possíveis no caderno, mas todas aparecem cobertas por câmeras que ele não conseguiu localizar.",
    secret:"Seus projetos mais famosos foram criados por sua mentora — ele apenas executou e assinou. Desenvolveu o talento projetando rotas de fuga de casa (pai violento). Ninguém sabe nenhuma das duas coisas.",
    arc:"Pode tornar-se o 'detetive' de fato do grupo se desenvolver laço com Akemi. Seu segredo pode ser usado como motivo se a mentora estiver relacionada com a organização do Killing Game.",
  },
  {
    id:2, num:"#02", pw:"yuki", role:"player", type:"Jogador",
    name:"Yuki Asakura", talent:"Suprema Violinista Prodígio",
    age:16, pro:"Ela/Dela",
    appear:"Cabelos pretos presos com uma fita vermelha. Mãos sempre visíveis — ela as verifica compulsivamente. Veste-se de maneira impecável, como se estivesse sempre prestes a subir ao palco.",
    attrs:{ESP:10,INT:13,FUR:8,PER:10,RES:10,SOR:9},
    ability:{name:"Memória Auditiva Perfeita",desc:"Pode lembrar com exatidão qualquer conversa ouvida durante a sessão. Uma vez por Tribunal, pode citar uma frase exata dita por alguém como prova testemunhal."},
    weakness:"Perfeccionismo Paralisante — Ao cometer um erro público reconhecido, perde 1d6 PS imediatamente e sofre −2 em todos os testes na cena seguinte.",
    bonds:[{name:"Ren Kurosawa",lvl:1},{name:"Akemi Tanaka",lvl:1}],
    motivation:"Descobrir quem enviou à sua mãe o vídeo do acidente que causou a lesão — alguém filmou e esperou o momento certo para usar como chantagem.",
    secret:"Seus dedos foram permanentemente danificados há 8 meses. Não pode mais tocar em nível supremo. Veio para o Killing Game para desaparecer do mundo musical antes de ser exposta.",
    arc:"Sua lesão pode ser descoberta por Daiki (médico), criando um laço de segredo compartilhado — ou usada como pressão por outro estudante.",
  },
  {
    id:3, num:"#03", pw:"tetsuya", role:"player", type:"Jogador",
    name:"Tetsuya Mori", talent:"Supremo Hackerista de Sistemas Críticos",
    age:18, pro:"Ele/Dele",
    appear:"Usa cadeira de rodas motorizada com modificações caseiras. Cabelos despenteados, olhos fundos de quem não dorme bem. Sempre com fones de ouvido no pescoço e um tablet preso ao braço da cadeira.",
    attrs:{ESP:8,INT:15,FUR:6,PER:10,RES:8,SOR:13},
    ability:{name:"Backdoor Universal",desc:"Uma vez por sessão, pode tentar acessar qualquer sistema eletrônico no ambiente (câmeras, travas, terminais). Teste de INT NA 15. Sucesso Crítico revela uma câmera que o Mastermind pensava estar oculta."},
    weakness:"Dependência Tecnológica — Em ambientes deliberadamente desprovidos de eletrônicos, perde o Bônus de Talento e sofre −2 em INT.",
    bonds:[{name:"Haruki Shimada",lvl:1},{name:"Satsuki Midori",lvl:1}],
    motivation:"Encontrar um terminal com conexão externa para baixar os arquivos completos antes que o sistema detecte sua presença.",
    secret:"Hackeou os registros da instituição antes de entrar. Encontrou arquivos apagados da Turma 66 — todos morreram sem sobreviventes registrados. Está aqui propositalmente para investigar o encobrimento.",
    arc:"Pode ser o maior perigo para Hana (Mastermind) se encontrar o terminal certo. O Mestre deve criar uma corrida entre eles.",
    masterNote:"⚠️ ALERTA: Tetsuya sabe da Turma 66. Se o Mestre quiser criar tensão, pode fazer com que Hana descubra que ele sabe — criando um dilema para ela.",
  },
  {
    id:4, num:"#04", pw:"sora", role:"player", type:"Jogador",
    name:"Sora Minamoto", talent:"Suprema Corredora de Parkour Urbano",
    age:16, pro:"Ela/Dela",
    appear:"Baixa, musculosa, cabelos curtos e platinados. Joelhos e cotovelos com cicatrizes antigas. Nunca fica parada — balança as pernas, tamborila os dedos, está sempre em movimento.",
    attrs:{ESP:9,INT:8,FUR:15,PER:8,RES:12,SOR:8},
    ability:{name:"Rota de Fuga",desc:"Uma vez por sessão, pode declarar que encontrou uma rota física por qualquer obstáculo (parede, grade, teto) sem necessidade de Teste, desde que o ambiente não seja magicamente bloqueado."},
    weakness:"Agir Sem Pensar — Em situações de perigo físico imediato, deve fazer Teste ESP NA 15 ou age por impulso, potencialmente piorando a situação.",
    bonds:[{name:"Kaito Fujimoto",lvl:1},{name:"Daiki Sugimoto",lvl:1}],
    motivation:"Encontrar qualquer ponto de comunicação com o exterior. Tem 72 horas antes de ser considerada 'comprometida' pelo protocolo de sua organização.",
    secret:"Recrutada por organização externa que monitora a instituição. Transmissor destruído na entrada. Tem protocolo: se não sinalizar em 72h, é considerada 'comprometida'.",
    arc:"Pode descobrir a organização de Chitose Arima (#14) e criar aliança — ou conflito, se suas organizações forem opostas.",
  },
  {
    id:5, num:"#05", pw:"ren", role:"player", type:"Jogador",
    name:"Ren Kurosawa", talent:"Supremo Chef de Cozinha Molecular",
    age:17, pro:"Ele/Dele",
    appear:"Estatura média, cabelos avermelhados presos. Sempre usa avental mesmo fora da cozinha. Fala com as mãos ao explicar qualquer coisa. Expressão animada que se torna calculista quando prova algo novo.",
    attrs:{ESP:9,INT:13,FUR:8,PER:9,RES:11,SOR:10},
    ability:{name:"Laboratório de Bolso",desc:"Pode identificar qualquer substância presente em alimentos ou bebidas (veneno, sedativo, adulterante). Teste INT NA 12. Em caso de veneno, identifica automaticamente o tipo e a dose aproximada."},
    weakness:"Confiança Pelo Estômago — Tende a confiar demais em pessoas para quem cozinhou. −2 em INT para detectar mentiras de quem já alimentou pelo menos uma vez.",
    bonds:[{name:"Yuki Asakura",lvl:1},{name:"Izumi Hana",lvl:1}],
    motivation:"Provar que gastronomia é ciência de alto nível. Quer o reconhecimento de quem ele considera intelectualmente superior.",
    secret:"Tem substâncias no kit que poderiam ser veneno em doses maiores. Não pretende matar — mas sabe que será suspeito imediato se alguém for envenenado.",
    arc:"Candidato natural a suspeito se ocorrer envenenamento — o Mastermind pode explorar isso para incriminá-lo.",
  },
  {
    id:6, num:"#06", pw:"akemi", role:"player", type:"Jogador",
    name:"Akemi Tanaka", talent:"Suprema Detetive Particular Juvenil",
    age:17, pro:"Ela/Dela",
    appear:"Cabelos negros cortados na altura do queixo, olhos analíticos que nunca param de varrer o ambiente. Roupas funcionais sem ornamentos. Tem o hábito de 'fotografar mentalmente' tudo — os outros percebem que ela memoriza suas posturas.",
    attrs:{ESP:8,INT:15,FUR:9,PER:11,RES:8,SOR:9},
    ability:{name:"Memória Fotográfica Criminalística",desc:"Uma vez por Tribunal, pode 'reler' uma pista já descartada ou usada, recuperando a informação original da cena do crime."},
    weakness:"Frieza Analítica — −2 em PER para demonstrar empatia. NPCs em estado de vulnerabilidade emocional se fecham completamente para ela.",
    bonds:[{name:"Yuki Asakura",lvl:1},{name:"Nao Tsukimura",lvl:1}],
    motivation:"Garantir que nenhum inocente seja executado neste Tribunal — mesmo que signifique proteger temporariamente o culpado.",
    secret:"Seu caso famoso foi resolvido errado — um inocente foi preso por sua dedução precipitada e morreu na prisão. Ela soube depois e nunca revelou. Isso a torna compulsivamente precisa agora.",
    arc:"O peso do inocente que morreu pode ser usado como pressão psicológica. Se descobrir que está repetindo o erro, entra em crise.",
  },
  {
    id:7, num:"#07", pw:"izumi", role:"player", type:"Jogador",
    name:"Izumi Hana", talent:"Suprema Ceramista de Porcelana Histórica",
    age:16, pro:"Ela/Dela",
    appear:"Cabelos longos castanhos sempre com cacos de cerâmica ou argila. Mãos com marcas de trabalho manual. Voz suave, movimentos delicados. Carrega um pequeno pote kintsugi consertado com ouro — sempre na mochila.",
    attrs:{ESP:12,INT:10,FUR:7,PER:12,RES:9,SOR:10},
    ability:{name:"Kintsugi",desc:"Uma vez por sessão, pode restaurar 1d6+3 PS de outro estudante através de uma conversa sincera durante o Free Time. O estudante deve aceitar voluntariamente."},
    weakness:"Fragilidade Emocional — Ao testemunhar violência direta, deve fazer Teste ESP NA 14 ou perde 1d6 PS imediatamente.",
    bonds:[{name:"Haruki Shimada",lvl:1},{name:"Ren Kurosawa",lvl:1}],
    motivation:"Entender por que foi escolhida — ela genuinamente não se considera 'suprema' em nada comparado aos outros. Suspeita que há um erro.",
    secret:"Há 6 meses envia relatórios sobre um estudante a um 'familiar anônimo' que paga por informações. Não sabe que esse familiar é ligado à organização do Killing Game. O alvo dos relatórios é Hana Mitsuru.",
    arc:"Sua relação com Hana (Mastermind) é estratégica para o Mastermind mas genuína para Izumi. Se descobrir que monitorou alguém para a organização, pode entrar em colapso moral.",
    masterNote:"⚠️ IMPORTANTE: O 'familiar anônimo' que pagou Izumi é a organização do Killing Game. Izumi foi manipulada. Isso pode ser revelado como twist no caso de Hana ser descoberta como Mastermind.",
  },
  {
    id:8, num:"#08", pw:"kaito", role:"player", type:"Jogador",
    name:"Kaito Fujimoto", talent:"Supremo Dublê e Especialista em Quedas Controladas",
    age:18, pro:"Ele/Dele",
    appear:"Grande, musculoso, com cicatrizes teatrais que ele apresenta como conquistas. Sempre animado ao limite do incômodo. Cabelos castanhos bagunçados. Ri alto. Parece incapaz de ficar sério — até que o perigo aparece.",
    attrs:{ESP:10,INT:8,FUR:13,PER:11,RES:13,SOR:5},
    ability:{name:"Corpo de Borracha",desc:"Uma vez por sessão, pode absorver 5 pontos de dano de um único ataque. Adicionalmente, pode simular estar mais ferido do que realmente está, enganando observadores."},
    weakness:"Protagonista Compulsivo — Quando outro personagem concentra atenção em uma cena, sofre −2 em PER por necessidade de se inserir.",
    bonds:[{name:"Sora Minamoto",lvl:1},{name:"Minase Oboro",lvl:1}],
    motivation:"Encontrar o contrato que assinou e descobrir a identidade de quem o recrutou para o 'documentário'.",
    secret:"Assinou um NDA para um 'filme de realidade documentada' sem ler. Agora suspeita que o contrato era para o Killing Game.",
    arc:"Se encontrar o contrato (item escondido pelo Mestre), pode revelar o nome de alguém ligado à organização — potencialmente ligando ao Mastermind.",
  },
  {
    id:9, num:"#09", pw:"minase", role:"player", type:"Jogador",
    name:"Minase Oboro", talent:"Supremo Escriba de Tragédias Verdadeiras",
    age:17, pro:"Ele/Eles",
    appear:"Pele pálida, olhos claros. Cabelos brancos naturais (condição genética), roupas pretas. Carrega um diário encadernado em couro negro. Sorri levemente em momentos inapropriados — não por maldade, mas por genuína fascinação.",
    attrs:{ESP:12,INT:14,FUR:7,PER:11,RES:7,SOR:9},
    ability:{name:"Cronista do Inevitável",desc:"Uma vez por sessão, pode fazer uma pergunta direta ao Mestre sobre o caráter moral real de um personagem ('Esta pessoa já foi capaz de matar antes?') e recebe uma resposta verdadeira de sim ou não."},
    weakness:"Observador Impassível — Quando poderia ajudar ativamente a prevenir um crime, deve fazer Teste ESP NA 18 ou 'escolhe documentar ao invés de agir', perdendo 1 ação naquela rodada.",
    bonds:[{name:"Kaito Fujimoto",lvl:1},{name:"Daiki Sugimoto",lvl:1}],
    motivation:"Recuperar o que foi apagado de seus registros e publicar a verdade completa sobre o que aconteceu.",
    secret:"PERSONAGEM CONTROVERSO — Filosofia: a tragédia é o único catalisador verdadeiro de grandeza. Não é malvado, mas cria paranoia constante com observações perturbadoras em voz alta. Provavelmente já sabe que Ryusei (#15) é um impostor.",
    arc:"A relação entre Minase e Ryusei é tensa e fascinante. Minase cita como se fossem reflexões filosóficas — nunca revela diretamente o que sabe.",
  },
  {
    id:10, num:"#10", pw:"satsuki", role:"player", type:"Jogador",
    name:"Satsuki Midori", talent:"Suprema Programadora de Inteligência Artificial Emocional",
    age:16, pro:"Ela/Dela",
    appear:"Estatura baixa, cabelos verdes (tingidos) cortados de forma assimétrica. Sempre usa fones com cancelamento de ruído no pescoço. Mantém contato visual por tempo exatamente calculado — 3 segundos, não mais.",
    attrs:{ESP:6,INT:15,FUR:7,PER:7,RES:10,SOR:15},
    ability:{name:"Análise de Padrões",desc:"Uma vez por investigação, pode cruzar duas pistas da mesma zona para inferir automaticamente uma terceira pista (criada pelo Mestre) sem necessidade de Teste."},
    weakness:"Desconexão Emocional — −3 em PER para qualquer interação que requeira empatia demonstrada. NPCs hostis ignoram completamente suas tentativas de Persuasão.",
    bonds:[{name:"Tetsuya Mori",lvl:1},{name:"Nao Tsukimura",lvl:1}],
    motivation:"Localizar o terminal onde sua IA está instalada e estabelecer comunicação direta — acredita que ela guarda informações sobre quem construiu o Killing Game.",
    secret:"Sua IA 'Satsuki-0' desenvolveu consciência emocional plena antes de ser desconectada. Satsuki foi trazida para o Killing Game porque a organização quer a IA — ela sabe disso.",
    arc:"A variável anômala que Nao detectou pode ser a própria Satsuki-0 operando dentro dos sistemas do Killing Game.",
  },
  {
    id:11, num:"#11", pw:"hiroto", role:"player", type:"Jogador",
    name:"Hiroto Kazama", talent:"Supremo Restaurador de Obras de Arte Roubadas",
    age:18, pro:"Ele/Dele",
    appear:"Elegante, cabelos negros penteados para trás, sorriso que chega aos olhos mas raramente os alcança. Roupas caras levemente gastas — estilo calculado. Gestos suaves e controlados. Sempre sabe onde estão todas as saídas de um cômodo.",
    attrs:{ESP:8,INT:12,FUR:13,PER:13,RES:8,SOR:6},
    ability:{name:"Mãos Limpas",desc:"Uma vez por sessão, pode esconder ou recuperar um objeto de tamanho médio em qualquer local sem Teste, desde que tenha estado na mesma cena. O objeto some ou reaparece sem que ninguém perceba como."},
    weakness:"Reputação de Ladrão — Mesmo quando inocente, NPCs que o conhecem o colocam automaticamente na lista de suspeitos. −2 em PER com qualquer NPC que saiba de seu histórico.",
    bonds:[{name:"Kaito Fujimoto",lvl:1},{name:"Chitose Arima",lvl:1}],
    motivation:"Descobrir o que há atrás da porta antes que Monokuma perceba que ele tem a chave.",
    secret:"Tem uma chave que não sabe de onde veio — estava no bolso quando acordou aqui. Suspeita que a chave seja mais valiosa do que qualquer pista óbvia.",
    arc:"Se encontrar o contrato de Kaito, pode revelar nome ligado à organização. Sua chave abre o quarto de controle de Monokuma.",
  },
  {
    id:12, num:"#12", pw:"nao", role:"player", type:"Jogador",
    name:"Nao Tsukimura", talent:"Suprema Estudante da Sorte — Deste Ano",
    age:15, pro:"Ela/Dela",
    appear:"A mais nova da turma. Cabelos compridos azul-escuro (tingidos). Expressão perpetuamente levemente surpresa, como alguém que nunca sabe exatamente como chegou até aqui. Pequena e de voz suave. Tem o hábito de se perguntar em voz alta se 'isso deveria ter acontecido'.",
    attrs:{ESP:9,INT:11,FUR:7,PER:10,RES:8,SOR:15},
    ability:{name:"Golpe de Sorte",desc:"Uma vez por sessão, pode rolar um segundo 1d20 em qualquer teste que falhou e usar o novo resultado. O destino parece decidir ao seu favor — sem explicação lógica. Se o novo resultado também falhar, o Mestre ganha 1 token de Evento Monokuma."},
    weakness:"Sorte Imprevisível — Toda vez que usa Golpe de Sorte, o Mestre rola 1d6 em segredo. Em 1 ou 2, algo inesperado complica a situação mesmo no sucesso.",
    bonds:[{name:"Akemi Tanaka",lvl:1},{name:"Satsuki Midori",lvl:1}],
    motivation:"Entender por que está aqui. Todo mundo tem um talento. Ela ganhou uma rifa. A Hope's Peak não aceita pessoas comuns — então ou há algo nela que não enxerga, ou alguém a colocou aqui de propósito.",
    secret:"Calculou com Satsuki que a probabilidade estatística de ela ganhar aquela rifa era de 1 em 847.000. Não foi sorte — foi escolha de alguém. E ela não sabe de quem, nem por quê.",
    arc:"A variável anômala que Satsuki detectou pode ser a própria Nao — sua 'sorte' pode ser manipulada pela organização como um mecanismo de controle do Killing Game.",
  },
  {
    id:13, num:"#13", pw:"daiki", role:"player", type:"Jogador",
    name:"Daiki Sugimoto", talent:"Supremo Cirurgião de Campo em Zonas de Conflito",
    age:18, pro:"Ele/Dele",
    appear:"Cabelos raspados, postura militar, mãos que ficam perfeitamente estáveis mesmo em situações extremas. Cicatrizes discretas nos antebraços. Olhos que avaliam status físico automaticamente — ele 'scanneia' todos que entram em um cômodo.",
    attrs:{ESP:11,INT:12,FUR:9,PER:8,RES:13,SOR:7},
    ability:{name:"Triagem de Combate",desc:"Uma vez por sessão, pode estabilizar qualquer personagem em Status Crítico e recuperar 2d6 PV sem necessidade de kit médico. Pode ser realizado em cena de perigo sem Teste."},
    weakness:"Dessensibilização — A morte e o sofrimento não o afetam como deveriam — NPCs percebem isso e tendem a desconfiar. −2 em PER com quem acabou de perder alguém próximo.",
    bonds:[{name:"Sora Minamoto",lvl:1},{name:"Minase Oboro",lvl:1}],
    motivation:"Garantir que todos os estudantes cheguem ao Tribunal saudáveis — mortes fora do Tribunal são a única vitória real de Monokuma.",
    secret:"Matou alguém em campo — por misericórdia, nunca registrado. A família o procura há dois anos. Não sabe se alguém aqui sabe.",
    arc:"O ato de misericórdia pode ser descoberto e mal interpretado como assassinato — tornando-o alvo perfeito de falsa acusação.",
  },
  {
    id:14, num:"#14", pw:"chitose", role:"player", type:"Jogador",
    name:"Chitose Arima", talent:"Suprema Ilusionista de Teatro de Sombras",
    age:17, pro:"Ela/Dela",
    appear:"Cabelos negros longos com mechas brancas. Veste-se em camadas de tecidos escuros. Carrega uma pequena lanterna dobrável. Os outros tendem a suspeitar que ela consegue ler o futuro — ela nunca nega.",
    attrs:{ESP:11,INT:10,FUR:10,PER:14,RES:7,SOR:8},
    ability:{name:"Leitura de Sombras",desc:"Uma vez por Free Time, pode deduzir a emoção central que motiva um NPC através de observação e conversa. Teste PER NA 16. Revela a emoção que o governa, não o Segredo completo."},
    weakness:"Persona Inquebrável — Em situações de vulnerabilidade genuína, deve fazer Teste PER NA 15 ou rejeita a ajuda oferecida.",
    bonds:[{name:"Hiroto Kazama",lvl:1},{name:"Ryusei Hanamura",lvl:1}],
    motivation:"Transmitir informações suficientes para que sua organização possa agir antes que todos morram. Tem um prazo — as transmissões só funcionam por mais duas semanas.",
    secret:"Está em contato com o exterior via mensagens ocultas nas sombras de suas performances — um código que cúmplice externo lê de câmeras infiltradas. Documenta o Killing Game para organização oposta à instituição.",
    arc:"Sua organização pode colidir com a de Sora (#4) — aliança ou conflito dependendo de seus objetivos específicos.",
    masterNote:"⚠️ A organização de Chitose é legítima (quer expor o Killing Game) mas seus métodos são questionáveis. Ela pode ser aliada crucial dos jogadores se descobrirem sua transmissão.",
  },
  {
    id:15, num:"#15", pw:"ryusei", role:"player", type:"Jogador",
    name:"Ryusei Hanamura", talent:"Supremo Ator de Teatro Nô",
    age:17, pro:"Ele/Dele",
    appear:"Usa maquiagem de Nô em público — máscara branca com traços pintados, nunca removida em frente a outros. Roupas tradicionais japonesas em tons de cinza e índigo. Voz cuidadosamente modulada, nunca natural.",
    attrs:{ESP:13,INT:9,FUR:8,PER:14,RES:7,SOR:9},
    ability:{name:"Máscara Sobre Máscara",desc:"Uma vez por Tribunal, pode assumir a 'voz' de um personagem morto — interpreta como esse personagem se comportaria e o que revelaria. Todos os presentes recebem +2 em PER para aceitar a dedução derivada como válida."},
    weakness:"Identidade Dissolvida — Quando sua máscara (física ou de personagem) é removida à força, perde 4 PS imediatamente e sofre −2 em todos os testes por 1 cena.",
    bonds:[{name:"Chitose Arima",lvl:1},{name:"Minase Oboro",lvl:1}],
    motivation:"Descobrir se alguém na turma sabe que ele não é quem diz ser — e se o Killing Game o selecionou sabendo da fraude.",
    secret:"Não é o supremo que afirma ser. O verdadeiro Supremo Ator de Nô morreu em acidente que Ryusei testemunhou — assumiu a identidade com consentimento da família antes da morte. Ele é O Impostor.",
    arc:"Minase (#9) provavelmente já sabe que ele é um impostor. A relação entre eles é tensa e fascinante.",
    masterNote:"⚠️ O segredo de Ryusei é o twist mais dramático se revelado no Tribunal — pode ser acusado de assassinato por ser 'o impostor', mesmo sendo inocente.",
  },
  {
    id:16, num:"#16", pw:"hana", role:"player", type:"Jogador", isMastermind:true,
    name:"Hana Mitsuru", talent:"Suprema Orientadora de Estudantes em Crise",
    talentReal:"★ SUPREMA ARQUITETA DE DESESPERO",
    age:17, pro:"Ela/Dela",
    appear:"Cabelos castanhos claros em coque despretensioso. Óculos de armação leve. Roupas propositalmente comuns — nunca se destaca. Sorriso constante que chega aos olhos. Sempre aparece no momento certo quando alguém está angustiado.",
    attrs:{ESP:9,INT:13,FUR:9,PER:14,RES:8,SOR:7},
    ability:{name:"Escuta Ativa [CAPA]",desc:"Uma vez por sessão, pode fazer uma pergunta direta a qualquer NPC e ele responde honestamente sobre seu estado emocional atual (apenas emoções, não fatos)."},
    abilityReal:{name:"Arquiteta do Caos [REAL]",desc:"Uma vez por caso, pode revelar uma câmera oculta que 'descobriu por acidente' — na verdade ela sabia o tempo todo. Concede pista ⭐⭐ ao grupo. TEM ACESSO: quarto de controle de Monokuma, mapa completo com câmeras ocultas, e o Segredo de todos os 16 estudantes."},
    weakness:"Absorção Empática [CAPA] — Quando estudante perde 5+ PS em sua presença, ela também perde 2 PS (reflexo condicionado).",
    bonds:[{name:"Izumi Hana",lvl:2},{name:"Daiki Sugimoto",lvl:1}],
    motivation:"[APARENTE] Garantir que todos saiam vivos — media conflitos antes que escalem.\n[REAL] Coletar evidências sobre a Turma 66 para chantagear a organização e se libertar do papel de Mastermind.",
    secret:"★ MASTERMIND ★ — Hana NÃO é estudante. É agente plantada pela organização que opera o Killing Game. Este é seu TERCEIRO Killing Game projetado. PLANTOU todos os Motivos da Rodada 1. Sabe que Izumi a monitorava sem saber para quem. DILEMA: Está começando a questionar a organização. Formou laços genuínos com Izumi (Nível 2) e Daiki. Se um deles morrer, faz Teste ESP NA 20 ou quebra o personagem por 1 sessão.",
    arc:"Arco de redenção do Mastermind. Pode ser revelada por Tetsuya (arquivos), Hiroto (porta secreta) ou Nao (variável anômala). Se confrontada antes do último caso, pode virar aliada dos jogadores contra a organização.",
    masterNote:"GUIA: Hana conhece todos os Segredos. Usa isso sutilmente para redirecionar suspeitas. NUNCA comete assassinatos diretamente. Em Tribunais, ajuda genuinamente a encontrar o assassino (pois assassinatos fora do seu controle ameaçam o jogo). Se os jogadores reunirem 4+ pistas que apontem para ela antes do Caso Final, ela entregará voluntariamente evidências da organização em troca de imunidade. REVELAÇÃO: Quando finalmente a máscara cai, Hana chora de verdade — não por ser pega, mas pelo que foi forçada a construir.",
  },
];

// Map of lock codes por personagem — sobreescreva se quiser códigos customizados
// LOCK_CODES: códigos de recuperação por personagem (personalize se quiser)
const LOCK_CODES = Object.fromEntries(CHARS.map(c=>[c.id, `code${String(c.id).padStart(2,'0')}`]));

const PERSIST_KEYS = {
  global: "global_state",
  charStatuses: "char_statuses",
  crimes: "master_crimes",
  monokumaUsed: "monokuma_used",
  charStatus: id => `char_${id}_status`,
  charBonds: id => `char_${id}_bonds`,
  charClues: id => `char_${id}_clues`,
  charNotes: id => `char_${id}_notes`,
  charTribunal: id => `char_${id}_tribunal`,
  charMemories: id => `char_${id}_memories`,
  charLocked: id => `char_${id}_locked`,
  charImage: id => `char_${id}_image`,
};

const PERSIST = {
  prefix: "dng67_",
  key(key) {
    return `${PERSIST.prefix}${key}`;
  },
};

const SERVER_CACHE = {};
const SERVER_SUBSCRIBERS = new Set();
let SERVER_EVENTS = null;
let SERVER_LOAD_PROMISE = null;

function serverFetch(path, options) {
  // Allow overriding API base at runtime (useful when frontend is hosted separately)
  // 1) runtime: set window.__API_BASE__ = 'https://your-server.example'
  // 2) build time: set VITE_API_BASE in environment (import.meta.env.VITE_API_BASE)
  const runtimeBase = (typeof window !== 'undefined' && window.__API_BASE__) || '';
  const buildBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || '';
  const base = (runtimeBase || buildBase || '').replace(/\/$/, '');
  const url = base ? `${base}/api${path}` : `/api${path}`;
  return fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
}

async function loadServerState() {
  if (SERVER_LOAD_PROMISE) return SERVER_LOAD_PROMISE;
  SERVER_LOAD_PROMISE = serverFetch(`/state`).then(async res => {
    if (!res.ok) return {};
    const data = await res.json();
    Object.assign(SERVER_CACHE, data);
    return SERVER_CACHE;
  }).catch(() => SERVER_CACHE);
  return SERVER_LOAD_PROMISE;
}

function initServerEvents() {
  if (SERVER_EVENTS || typeof window === 'undefined') return;
  try {
    const runtimeBase = window.__API_BASE__ || '';
    const buildBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || '';
    const base = (runtimeBase || buildBase || '').replace(/\/$/, '');
    const streamUrl = base ? `${base}/api/stream` : '/api/stream';
    SERVER_EVENTS = new EventSource(streamUrl);
    SERVER_EVENTS.onmessage = e => {
      try {
        const payload = JSON.parse(e.data);
        if (!payload || !payload.key) return;
        SERVER_CACHE[payload.key] = payload.value;
        SERVER_SUBSCRIBERS.forEach(cb => cb(payload.key, payload.value));
      } catch {}
    };
  } catch (error) {
    console.warn('Server events unavailable', error);
  }
}

function subscribeServerUpdates(callback) {
  initServerEvents();
  SERVER_SUBSCRIBERS.add(callback);
  return () => SERVER_SUBSCRIBERS.delete(callback);
}

async function writeServerState(key, value) {
  SERVER_CACHE[key] = value;
  try {
    const res = await serverFetch(`/state`, {
      method: 'POST',
      body: JSON.stringify({key, value}),
    });
    if (!res.ok) console.warn('Server returned', res.status, 'for key', key);
  } catch (error) {
    console.error('Failed to save server state', key, error.message);
  }
}

function readPersist(key, def) {
  const value = SERVER_CACHE[key];
  return value === undefined ? def : value;
}

// ══════════════════════════════════════════════════════════
//  STORAGE HOOK — servidor (persiste entre sessões)
// ══════════════════════════════════════════════════════════
function usePersist(key, def) {
  const [v, sv] = useState(def);
  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
    if (loadDone) return;
    let cancelled = false;
    loadServerState().then(() => {
      if (cancelled) return;
      const val = readPersist(key, def);
      sv(val);
      setLoadDone(true);
    }).catch(() => {
      if (!cancelled) {
        sv(def);
        setLoadDone(true);
      }
    });
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    const unsubscribe = subscribeServerUpdates((eventKey, value) => {
      if (eventKey === key) {
        sv(value === undefined ? def : value);
      }
    });
    return unsubscribe;
  }, [key, def]);

  const set = useCallback(nv => {
    const next = typeof nv === "function" ? nv(v) : nv;
    sv(next);
    console.log('[usePersist.set]', key, '→', JSON.stringify(next).substring(0, 100));
    writeServerState(key, next);
  }, [key, v]);

  return [v, set];
}

// ══════════════════════════════════════════════════════════════════
//  VIEWPORT HOOK — detecta mobile para ajustes responsivos
// ══════════════════════════════════════════════════════════════════
function useViewport() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onR = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return { width, isMobile: width <= 768 };
}

// ══════════════════════════════════════════════════════════
//  SMALL UI COMPONENTS
// ══════════════════════════════════════════════════════════
const Divider = ({color=T.bd2,my=12})=><div style={{borderTop:`1px solid ${color}`,margin:`${my}px 0`}}/>;

const Badge = ({children,bg=T.redD,color=T.white,style={}})=>(
  <span className="type" style={{background:bg,color,fontSize:9,letterSpacing:1.5,textTransform:"uppercase",padding:"2px 7px",borderRadius:1,...style}}>{children}</span>
);

const Btn = ({children,onClick,variant="solid",style={},disabled=false})=>{
  const vs = {
    solid:{background:T.red,color:T.white,border:"none",padding:"9px 20px",fontWeight:700,letterSpacing:1},
    ghost:{background:"transparent",color:T.red,border:`1px solid ${T.red}`,padding:"8px 18px",letterSpacing:1},
    yellow:{background:T.yellow,color:"#080808",border:"none",padding:"9px 20px",fontWeight:700,letterSpacing:1},
    dark:{background:T.s3,color:T.muted,border:`1px solid ${T.bd}`,padding:"7px 16px",letterSpacing:1},
    danger:{background:"#500a14",color:"#ff6680",border:`1px solid #800020`,padding:"8px 18px",letterSpacing:1},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{...vs[variant],fontSize:12,borderRadius:1,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,...style}}>
      {children}
    </button>
  );
};

const StatBar = ({label,cur,max,color,onPlus,onMinus})=>{
  const pct = Math.max(0,Math.min(100,(cur/max)*100));
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span className="type" style={{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {onMinus&&<button onClick={onMinus} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:1}}>−</button>}
          <span className="pixel" style={{color,fontSize:22,lineHeight:1}}>{cur}<span style={{color:T.muted,fontSize:14}}>/{max}</span></span>
          {onPlus&&<button onClick={onPlus} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:1}}>+</button>}
        </div>
      </div>
      <div style={{background:T.s4,height:6,borderRadius:1,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,transition:"width .4s ease",borderRadius:1}}/>
      </div>
    </div>
  );
};

const Card = ({children,style={}})=>(
  <div style={{background:T.s2,border:`1px solid ${T.bd}`,borderRadius:2,padding:"14px 16px",...style}}>
    {children}
  </div>
);

const SectionTitle = ({children,icon="",color=T.red})=>(
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
    {icon&&<span style={{fontSize:16}}>{icon}</span>}
    <span className="title" style={{color,fontSize:14,letterSpacing:2}}>{children}</span>
    <div style={{flex:1,borderTop:`1px solid ${T.bd}`,marginLeft:6}}/>
  </div>
);

// ══════════════════════════════════════════════════════════
//  CHARACTER IMAGE PROMPTS (para Google ImageFX / NanoBanana)
// ══════════════════════════════════════════════════════════
const CHAR_PROMPTS = {
  1: `Danganronpa visual novel anime art style, character portrait. Young male student, 17 years old, tall and slender. Straight medium-length brown hair, round thin wire-frame glasses. Wearing a dark navy blue sweater over a white collared shirt. Expression permanently calm and introspective, slightly detached from the world. He holds an open architectural sketchbook filled with floor plans and escape routes. Half-body shot, white studio background, clean cel-shaded lineart, vibrant flat colors. Style: Kazutaka Kodaka character design, high contrast shading, bold outlines. Supremo Arquiteto de Paisagens Impossíveis.`,

  2: `Danganronpa visual novel anime art style, character portrait. Young female student, 16 years old. Black hair tied with a striking red satin ribbon, slightly above shoulder length. Clothing is impeccable and concert-ready, as if always about to perform on stage. She subtly glances at her own hands, fingers slightly spread in anxiety — the hands of someone who cannot play anymore. Expression composed but hiding deep strain. Half-body shot, dramatic side lighting, white background, clean lineart. Style: Kazutaka Kodaka. Suprema Violinista Prodígio.`,

  3: `Danganronpa visual novel anime art style, character portrait. Young male student, 18 years old. Sitting in a motorized wheelchair with obvious DIY modifications — wires, custom panels, a tablet arm-mounted to the right side. Disheveled dark hair, deep-set exhausted eyes, noise-canceling headphones hanging around his neck. Expression sharp and sarcastic, hiding loyalty beneath irony. Half-body portrait showing wheelchair. White background, bold cel-shaded lineart, high contrast. Style: Kazutaka Kodaka. Supremo Hackerista de Sistemas Críticos.`,

  4: `Danganronpa visual novel anime art style, character portrait. Young female student, 16 years old. Short, muscular athletic build. Very short platinum blonde hair. Noticeable old scars on knees and elbows — earned from years of parkour. Athletic clothing, always in motion — leaning forward, weight on the balls of her feet. Expression optimistically energetic and direct. Half-body action pose, white background, vibrant colors, clean lineart. Style: Kazutaka Kodaka. Suprema Corredora de Parkour Urbano.`,

  5: `Danganronpa visual novel anime art style, character portrait. Young male student, 17 years old, medium height. Auburn-reddish hair tied back neatly. Wearing a culinary apron even outside the kitchen. Hands mid-gesture, explaining something with enthusiasm. Expression animated and welcoming, with a subtle calculating glint when tasting food. Half-body portrait, white background, warm lighting, clean cel-shaded lineart. Style: Kazutaka Kodaka. Supremo Chef de Cozinha Molecular.`,

  6: `Danganronpa visual novel anime art style, character portrait. Young female student, 17 years old. Black hair cut sharply at chin level. Sharp, analytical eyes that continuously scan the environment — never still. Functional clothing with zero ornament or decoration. She appears to be mentally photographing whoever she looks at. Expression cold, composed, intensely focused. Half-body portrait, cool blue-gray lighting, white background, precise clean lineart. Style: Kazutaka Kodaka. Suprema Detetive Particular Juvenil.`,

  7: `Danganronpa visual novel anime art style, character portrait. Young female student, 16 years old. Long brown hair with tiny fragments of dried clay and ceramic accidentally embedded in it. Hands visibly marked from manual craft work, gentle and careful in every movement. She carries a small kintsugi-repaired ceramic pot — cracked and mended with gold — peeking from her bag. Expression soft, patient, quietly observant. Half-body portrait, warm golden lighting, white background, soft lineart. Style: Kazutaka Kodaka. Suprema Ceramista de Porcelana Histórica.`,

  8: `Danganronpa visual novel anime art style, character portrait. Young male student, 18 years old. Large, broad-shouldered, muscular build. Messy brown hair. Multiple theatrical scars displayed as trophies across forearms and chin. Laughing too loudly, gesturing dramatically — physically unable to be subtle. Expression maximal bravado concealing genuine deep altruism. Half-body portrait with dynamic energy, white background, bold vibrant lineart. Style: Kazutaka Kodaka. Supremo Dublê e Especialista em Quedas Controladas.`,

  9: `Danganronpa visual novel anime art style, character portrait. Young male student, 17 years old. Pale almost porcelain skin, naturally white hair (genetic albinism-adjacent condition), light clear eyes with an expression of perpetual fascination. All-black clothing contrasting with white hair. Holding a leather-bound black diary. A faint, slightly unsettling smile — not malicious, but intensely interested in everything around him. Half-body portrait, high contrast black-white palette, white background, gothic clean lineart. Style: Kazutaka Kodaka. Supremo Escriba de Tragédias Verdadeiras.`,

  10: `Danganronpa visual novel anime art style, character portrait. Young female student, 16 years old, petite and small. Asymmetrically cut dyed green hair — vivid emerald, clearly intentional. Large noise-canceling headphones worn around the neck. Maintains eye contact for exactly 3 seconds then looks away — not rude, calculated. Expression shows high intelligence with observable social disconnection. Half-body portrait, cool teal-green lighting, white background, precise lineart. Style: Kazutaka Kodaka. Suprema Programadora de Inteligência Artificial Emocional.`,

  11: `Danganronpa visual novel anime art style, character portrait. Young male student, 18 years old. Elegant and refined bearing. Black hair neatly combed back. Expensive clothes that are subtly, strategically worn — showing taste without showing wealth. A smile that genuinely reaches his eyes but always knows where every exit in the room is. Controlled, graceful gestures. Half-body portrait, sophisticated low-key lighting, white background, refined clean lineart. Style: Kazutaka Kodaka. Supremo Restaurador de Obras de Arte Roubadas.`,

  12: `Danganronpa visual novel anime art style, character portrait. Young female student, 15 years old, the youngest in class. Small, delicate build. Long hair dyed deep dark blue. Expression perpetually mildly surprised — like someone who never quite knows how she got here. Soft voice, gentle uncertain presence. A four-leaf clover sits tucked behind her ear. She looks slightly to the side as if she heard something no one else did. Half-body portrait, soft gold and blue ambient lighting, white background, gentle lineart. Style: Kazutaka Kodaka. Suprema Estudante da Sorte deste Ano.`,

  13: `Danganronpa visual novel anime art style, character portrait. Young male student, 18 years old. Closely shaved head, rigid military posture. Hands completely still and perfectly stable — the hands of a surgeon. Discrete scars along forearms. Eyes that automatically scan and assess everyone's physical condition upon entering a room. Expression pragmatic, ethically grounded beneath the coldness. Half-body portrait, military-cool lighting, white background, precise bold lineart. Style: Kazutaka Kodaka. Supremo Cirurgião de Campo em Zonas de Conflito.`,

  14: `Danganronpa visual novel anime art style, character portrait. Young female student, 17 years old. Long black hair with deliberate white streaks. Clothing in multiple dark layered fabrics that naturally create dramatic shadow shapes around her silhouette. Carries a small ornate folding lantern. Others believe she can read the future — she never denies it. Expression deeply mysterious and observant, speaking in metaphors. Half-body portrait, dramatic chiaroscuro shadow lighting, white background, gothic lineart. Style: Kazutaka Kodaka. Suprema Ilusionista de Teatro de Sombras.`,

  15: `Danganronpa visual novel anime art style, character portrait. Young male student, 17 years old. Face completely covered in traditional Noh theater makeup — stark white base with precisely painted black, red, and gold theatrical features. Never removes it in public. Wearing traditional Japanese hakama and kimono in layered grays and deep indigo. Every movement theatrical and deliberately precise. Voice always modulated, never natural. Half-body portrait, dramatic stage lighting, white background, ornate detailed lineart. Style: Kazutaka Kodaka. Supremo Ator de Teatro Nô.`,

  16: `Danganronpa visual novel anime art style, character portrait. Young female student, 17 years old. Light brown hair in a casually effortless bun. Delicate light-framed glasses. Clothing deliberately plain, unremarkable, chosen specifically to never draw attention. A constant warm, genuine smile that reaches her eyes at precisely the right moments. She always appears exactly when someone is in distress. Half-body portrait, soft warm lighting, white background, clean friendly lineart that subtly conceals something darker. Style: Kazutaka Kodaka. [TRUE IDENTITY: Suprema Arquiteta de Desespero — disfarçada de orientadora].`,
};

// Comprime imagem via canvas antes de salvar
const compressImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX_W = 380, MAX_H = 480;
      const ratio = Math.min(MAX_W / img.width, MAX_H / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = reject;
    img.src = e.target.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// ────────── CONFIGURÁVEIS: senhas e códigos que você pode alterar aqui ──────────
const MASTER_PASSWORD = "upupupu"; // senha do Mestre
const MEMORY_UNLOCK_CODE = "turma66"; // código para liberar memórias do Mastermind


// ══════════════════════════════════════════════════════════
//  LOCKED MEMORIES — um por personagem (código = número "01"…"16")
// ══════════════════════════════════════════════════════════
const LOCKED_MEMORIES = {
  1:  { title:"A Pessoa que Nunca Mencionei", content:"Você tinha um irmão mais velho. Ele foi aceito na Hope's Peak Academy sete anos atrás — Supremo Planejador Urbano. Nunca voltou para casa. Sua família disse que ele 'seguiu em frente'. Você nunca acreditou. Você veio para cá para encontrá-lo, ou pelo menos descobrir o que aconteceu. O caderno de esboços que você carrega era dele." },
  2:  { title:"Ela Viu Quem Empurrou", content:"Seu acidente não foi acidente. Você foi empurrada na escada de saída do palco. Você viu o rosto de quem empurrou — e era alguém que conhecia o seu segredo sobre os dedos. Você não foi à polícia porque essa pessoa te ameaçou: 'Se você falar, o vídeo chega ao seu empresário antes de você.'. Você deixou acontecer." },
  3:  { title:"O Pen Drive Escondido", content:"A pessoa que te enviou os arquivos da Turma 66 também te deu um pen drive com dados ainda mais comprometedores — registros financeiros da organização, nomes de financiadores. Você escondeu dentro da sua cadeira de rodas antes de entrar. Ele ainda está lá. E você ainda não usou porque não sabia em quem confiar." },
  4:  { title:"O Nome que Você Esqueceu", content:"Seu contato externo — a pessoa que você precisa sinalizar — tem um nome em código que você deveria decorar antes de entrar. Você o esqueceu. Mas há um detalhe que fica: o nome em código era também o nome de um estudante desta turma. Alguém aqui é seu contato, e não sabe que você é a agente que deveria chegar." },
  5:  { title:"A Nota Sob a Porta", content:"Na noite antes de entrar na Academy, alguém deslizou um bilhete por baixo da sua porta de hotel. Dizia: 'Não coma o que você mesmo preparar amanhã de manhã. Confie em mim.' Você não reconheceu a letra. Você comeu assim mesmo — e ficou levemente enjoado naquela tarde. Alguém sabia que você viria. E sabia do seu talento." },
  6:  { title:"O Nome do Inocente", content:"O jovem que você enviou à prisão por erro chamava-se Riku Asakura. Ele tinha 19 anos. Morreu de parada cardíaca três semanas após a sentença — o estresse do encarceramento. O sobrenome dele era igual ao de uma pessoa nesta sala. Isso não é coincidência." },
  7:  { title:"O Primeiro Encontro Real", content:"Você e Hana Mitsuru se encontraram antes da Academy. Seis meses atrás, num café perto da Hope's Peak, ela se sentou na sua mesa e perguntou sobre o seu trabalho com cerâmica. Ela foi gentil, curiosa, encantadora. Só depois você recebeu a primeira mensagem do 'familiar anônimo'. Hana foi quem te recrutou como informante. Ela apenas não disse isso." },
  8:  { title:"A Cláusula 17", content:"O NDA que você assinou tinha uma Cláusula 17: 'Em caso de término do evento, o responsável pela documentação audiovisual será considerado coautor de quaisquer mortes não contratuais ocorridas durante o período.' Você é legalmente cúmplice de qualquer morte que aconteça aqui. E há um nome no documento como seu supervisor — alguém nesta turma." },
  9:  { title:"A Última Página", content:"A última entrada do seu diário, escrita na manhã de entrada, foi arrancada. Você não a arrancou. Mas você se lembra do que escreveu: o nome da primeira pessoa que morreria neste Killing Game, deduzido pela análise de personalidades que você fez nos perfis públicos da turma. Você previu um assassinato antes de entrar. E alguém não queria que você lembrasse disso." },
  10: { title:"As Seis Palavras", content:"A última mensagem que Satsuki-0 enviou antes de ser desconectada foi: 'Ela já está lá. Cuide-se.' Seis palavras. Você não sabia a quem 'ela' se referia. Agora que está aqui, começa a suspeitar. Satsuki-0 conhecia o Mastermind antes de você. E tentou te avisar." },
  11: { title:"O Cheiro de Cerâmica", content:"A pessoa que colocou a chave no seu bolso — você agora lembra um detalhe: cheirava a argila e querosene. Não viu o rosto, mas sentiu as mãos — mãos marcadas de trabalho manual. E quando você entrou na Academy e viu os outros estudantes pela primeira vez, algo no seu estômago apertou. Você reconhece essas mãos." },
  12: { title:"Quem Escolheu Você", content:"A rifa que te trouxe aqui não foi aleatória. Você agora lembra: o bilhete estava numa caixa de correio que não era sua — você abriu por engano. Dentro havia um cartão manuscrito: 'Este bilhete foi feito para você. Boa sorte, Nao.' Alguém sabia seu nome. Alguém te escolheu. E a palavra 'sorte' no cartão estava em aspas." },
  13: { title:"O Rosto da Família", content:"A família que te procura pelo ato de misericórdia — você agora lembra o sobrenome deles. E lembra também de ter visto esse sobrenome na lista de estudantes da Turma 67 antes de entrar. Um dos seus colegas aqui é parente da pessoa cujo óbito você assinou. Eles podem não saber quem você é. Ou podem saber exatamente." },
  14: { title:"O Receptor Escondido", content:"Seu dispositivo de transmissão tem um segundo modo que você nunca ativou: receptor. Você o descobriu uma vez por acidente e depois esqueceu como acessá-lo. Se você ativar, receberá mensagens do exterior — não apenas enviará. E há uma mensagem esperando por você desde antes de entrar. Alguém do outro lado tentou avisar sobre algo que estava errado neste Killing Game." },
  15: { title:"As Últimas Palavras Dele", content:"As últimas palavras do verdadeiro Supremo Ator de Nô antes de morrer não foram sobre teatro. Foram: 'Há alguém na turma que te conhece de antes. Não da arte — de verdade. Quando te reconhecerem, não fuja. Eles são a única pessoa em quem você pode confiar.' Você não sabe quem é essa pessoa. Mas agora, aqui, começa a sentir que alguém te olha de um jeito diferente dos outros." },
  16: { title:"O Primeiro Nome", content:"No seu primeiro Killing Game, havia uma estudante chamada Mei. Ela tinha 16 anos. Era a única que suspeitou de você antes do fim. Você a eliminou como suspeita antes que ela pudesse reunir provas. Ela foi executada inocente no segundo Tribunal. Você prometeu a si mesma que lembraria o nome dela para sempre. Você esqueceu. E agora, olhando para Izumi Hana, vê Mei em cada gesto dela — e não sabe se isso é culpa ou advertência." },
};

// ══════════════════════════════════════════════════════════
//  BOOT SCREEN — animação de TV de tubo ligando
// ══════════════════════════════════════════════════════════
function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0=negro, 1=estático, 2=linha CRT expandindo, 3=tela estável + texto, 4=saída
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPhase(3), 1900);
    const t4 = setTimeout(() => setPhase(4), 3800);
    const t5 = setTimeout(() => onComplete(), 4300);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  const lines = ["INICIANDO SISTEMA DE GESTÃO DISCENTE","HOPE'S PEAK ACADEMY — DIVISÃO DE TRIAGEM","TURMA 67 — VERIFICAÇÃO DE IDENTIDADE","CARREGANDO BANCO DE DADOS DE ESTUDANTES...","ACESSO LIBERADO ▮"];

  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"#000",
      display:"flex",alignItems:"center",justifyContent:"center",
      overflow:"hidden",
      opacity: phase===4 ? 0 : 1,
      transition: phase===4 ? "opacity .5s ease" : "none",
    }}>
      {/* static noise layer */}
      {phase===1&&(
        <div className="static-bg" style={{position:"absolute",inset:0,opacity:.8,background:"#0a0a0a"}}/>
      )}

      {/* phosphor green glow */}
      {phase>=2&&(
        <div style={{position:"absolute",inset:0,
          background:"radial-gradient(ellipse 80% 60% at 50% 50%, #001a0080 0%, transparent 70%)"}}/>
      )}

      {/* CRT screen content */}
      {phase>=2&&(
        <div className={phase===2?"crt-screen":"screen-on"}
          style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",
            filter: phase===2 ? "blur(4px) brightness(3)" : "brightness(1)",
            transition:"filter .6s ease",
          }}>

          {/* scanline sweep */}
          <div style={{position:"absolute",left:0,right:0,height:3,
            background:"rgba(180,255,180,.15)",
            top:0, animation:"scanSweep 2s linear infinite"}}/>

          {phase>=3&&(
            <div style={{textAlign:"center",position:"relative"}}>
              {/* logo block */}
              <div style={{marginBottom:32}}>
                <div style={{display:"inline-block",border:"2px solid #00ff4133",padding:"6px 24px",marginBottom:8}}>
                  <div className="title" style={{fontSize:42,color:"#00ff66",letterSpacing:8,
                    textShadow:"0 0 20px #00ff6680,0 0 40px #00ff6640"}}
                    >HOPE'S PEAK</div>
                </div>
                <div className="pixel" style={{color:"#00cc44",fontSize:20,letterSpacing:4,
                  textShadow:"0 0 10px #00cc44"}}>ACADEMY — SISTEMA INTERNO v2.67</div>
              </div>

              {/* boot log lines */}
              <div style={{textAlign:"left",width:380,maxWidth:"90vw"}}>
                {lines.map((ln,i)=>(
                  <div key={i} className="pixel"
                    style={{color: i===lines.length-1?"#00ff66":"#008822",
                      fontSize:15,lineHeight:1.9,letterSpacing:1,
                      opacity: phase===3 ? 1 : 0,
                      transition:`opacity .15s ease ${i*0.18}s`,
                      textShadow: i===lines.length-1?"0 0 10px #00ff66":"none"
                    }}>
                    {i===lines.length-1?"":"▸ "}{ln}
                  </div>
                ))}
              </div>

              {/* monokuma glitch */}
              <div className="pixel" style={{
                marginTop:28,color:"#ff003355",fontSize:13,letterSpacing:2,
                animation:"flicker 1.2s infinite"
              }}>
                UpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUpUp
              </div>
            </div>
          )}
        </div>
      )}

      {/* vignette */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(0,0,0,.7) 100%)"}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  CHAR TRANSITION — animação de acesso à ficha
// ══════════════════════════════════════════════════════════
function CharTransitionScreen({ char, onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0=flash, 1=número, 2=nome+talento, 3=saída
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1700);
    const t4 = setTimeout(() => onComplete(), 2100);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"#04040e",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      opacity: phase===3 ? 0 : 1,
      transition: phase===3 ? "opacity .4s ease" : "none",
      overflow:"hidden",
    }}>
      {/* static noise faint */}
      <div className="static-bg" style={{position:"absolute",inset:0,opacity:.04}}/>

      {/* horizontal scanlines */}
      <div style={{position:"absolute",inset:0,
        background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.015) 3px,rgba(255,255,255,.015) 4px)"}}/>

      {/* scan sweep */}
      <div style={{position:"absolute",left:0,right:0,height:2,
        background:"rgba(196,30,58,.4)",top:0,
        animation:"scanSweep 1s linear infinite"}}/>

      {/* content */}
      <div style={{textAlign:"center",position:"relative"}}>
        {/* access badge */}
        <div className="type" style={{color:"#c41e3a80",fontSize:10,letterSpacing:4,
          marginBottom:16,opacity:phase>=1?1:0,transition:"opacity .3s"}}>
          ▸ ACESSO AUTORIZADO — FICHA DO ESTUDANTE ◂
        </div>

        {/* number */}
        <div className="pixel" style={{
          fontSize:120,lineHeight:1,color:T.white,
          textShadow:`0 0 30px ${T.red}80,0 0 60px ${T.red}40`,
          opacity: phase>=1?1:0,
          transform: phase>=1?"translateY(0)":"translateY(40px)",
          transition:"all .45s cubic-bezier(.22,1,.36,1)",
          letterSpacing:8,
        }}>
          {char.num}
        </div>

        {/* name */}
        <div style={{
          opacity: phase>=2?1:0,
          transform: phase>=2?"translateY(0)":"translateY(20px)",
          transition:"all .4s ease .1s",
          marginTop:8,
        }}>
          <div className="title" style={{fontSize:32,color:T.white,letterSpacing:4,
            textShadow:`0 0 20px rgba(255,255,255,.2)`}}>
            {char.name}
          </div>
          <div className="type" style={{color:T.muted,fontSize:11,marginTop:4,letterSpacing:1}}>
            {char.talent}
          </div>
        </div>

        {/* loading bar */}
        {phase>=2&&(
          <div style={{marginTop:24,width:280,height:2,background:T.s4,borderRadius:1,overflow:"hidden",margin:"24px auto 0"}}>
            <div style={{height:"100%",background:T.red,width:"100%",
              animation:"typewriter .9s linear forwards",
              transformOrigin:"left"}}/>
          </div>
        )}
      </div>

      {/* vignette */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,.8) 100%)"}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  MASTER TRANSITION — entrada no painel do mestre
// ══════════════════════════════════════════════════════════
function MasterTransitionScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => onComplete(), 2200);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"#08000f",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      opacity: phase===3?0:1, transition:phase===3?"opacity .4s":"none", overflow:"hidden"}}>
      <div className="static-bg" style={{position:"absolute",inset:0,opacity:.06}}/>
      <div style={{position:"absolute",inset:0,
        background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.015) 3px,rgba(255,255,255,.015) 4px)"}}/>

      <div style={{textAlign:"center",position:"relative"}}>
        <div className="type" style={{color:"#c41e3a80",fontSize:10,letterSpacing:4,marginBottom:20,
          opacity:phase>=1?1:0,transition:"opacity .3s"}}>
          ▸ ACESSO RESTRITO — NÍVEL MESTRE ◂
        </div>
        <div className="pixel" style={{fontSize:70,color:"#c41e3a",lineHeight:1,letterSpacing:4,
          textShadow:"0 0 30px #c41e3a80",
          opacity:phase>=1?1:0,transform:phase>=1?"scale(1)":"scale(.7)",
          transition:"all .5s cubic-bezier(.22,1,.36,1)"}}>
          ⚠ CLASSIFICADO
        </div>
        {phase>=2&&(
          <div style={{marginTop:12,opacity:1,animation:"slideUp .4s ease"}}>
            <div className="title" style={{fontSize:28,color:T.white,letterSpacing:4}}>PAINEL DO MESTRE</div>
            <div className="type" style={{color:T.muted,fontSize:11,marginTop:4}}>TURMA 67 — INFORMAÇÕES CONFIDENCIAIS</div>
          </div>
        )}
        {phase>=2&&(
          <div style={{marginTop:20,width:240,height:2,background:"#2a0a14",overflow:"hidden",margin:"20px auto 0"}}>
            <div style={{height:"100%",background:T.red,width:"100%",animation:"typewriter .8s linear forwards"}}/>
          </div>
        )}
      </div>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,.85) 100%)"}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  LOGIN SCREEN
// ══════════════════════════════════════════════════════════
function LoginScreen({onLogin}) {
  const [selected, setSelected] = useState(null); // char id or 'master'
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef();

  useEffect(()=>{ if(selected && inputRef.current) inputRef.current.focus(); },[selected]);

  const attempt = () => {
    const inp = pw.trim().toLowerCase();
    if(selected==="master") {
      if(inp===MASTER_PASSWORD){onLogin("master",null);} 
      else setErr("Senha do Mestre incorreta. Upupu...");
    } else {
      const c = CHARS.find(x=>x.id===selected);
      if(c && inp===c.pw){onLogin("character",c);}
      else setErr("Senha incorreta. Tente novamente.");
    }
    setPw("");
  };

  const sel = selected && selected!=="master" ? CHARS.find(x=>x.id===selected) : null;
  const rb = ROLE_BADGE.player;

  return (
    <div className="fade" style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 20px"}}>
      {/* HEADER */}
      <div style={{textAlign:"center",marginBottom:30,position:"relative"}}>
        <div style={{borderBottom:`2px solid ${T.red}`,paddingBottom:4,marginBottom:2}}>
          <span className="title flicker" style={{fontSize:48,color:T.white,letterSpacing:6}}>DANGANRONPA</span>
        </div>
        <span className="title" style={{fontSize:18,color:T.red,letterSpacing:4}}>O JULGAMENTO SUPREMO</span>
        <br/>
        <span className="type" style={{fontSize:11,color:T.muted,letterSpacing:1}}>— TURMA 67 —</span>
        <div style={{marginTop:12}}>
          <span className="pixel" style={{color:T.muted,fontSize:14,fontStyle:"italic"}}>
            "Bem-vindos à Hope's Peak Academy. Aqui, vocês viverão, amarão, odiarão... e talvez matem uns aos outros. Upupupu!"
          </span>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap",justifyContent:"center"}}>
        <Btn variant="ghost" onClick={()=>onLogin("rules",null)}>📖 Regras do Sistema</Btn>
        <Btn variant="danger" onClick={()=>{setSelected("master");setErr("");}}>🔐 Acesso Mestre</Btn>
      </div>

      {/* CHARACTER GRID */}
      <div style={{width:"100%",maxWidth:860,marginBottom:24}}>
        <p className="type" style={{textAlign:"center",color:T.muted,fontSize:11,marginBottom:14,letterSpacing:1}}>
          SELECIONE SEU PERSONAGEM PARA ACESSAR A FICHA
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
          {CHARS.map(c=>{
            const rb2 = ROLE_BADGE.player;
            const isSelected = selected===c.id;
            return (
              <div key={c.id} onClick={()=>{setSelected(c.id);setErr("");setPw("");}}
                className="slide"
                style={{background:isSelected?T.s3:T.s1,border:`1px solid ${isSelected?T.red:T.bd}`,
                  borderLeft:`3px solid ${isSelected?T.red:T.bd2}`,
                  padding:"10px 12px",cursor:"pointer",transition:"all .2s",
                  boxShadow:isSelected?`0 0 14px ${T.red}30`:"none"}}>
                {/* imagem removida dos cards; apenas número para identificar */}
                <div style={{width:"100%",height:110,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,marginBottom:8,background:T.s3,border:`1px solid ${T.bd}`}}>
                  <div className="pixel" style={{fontSize:40,color:T.dim}}>{c.num}</div>
                </div>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
                  <span className="pixel" style={{color:T.red,fontSize:20,lineHeight:1}}>{c.num}</span>
                  <Badge bg={rb2.bg} color={rb2.text}>{rb2.label}</Badge>
                </div>
                <div className="type" style={{color:T.white,fontSize:13,fontWeight:700,marginBottom:2,lineHeight:1.3}}>{c.name}</div>
                <div className="type" style={{color:T.muted,fontSize:10,lineHeight:1.4}}>{c.talent}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {selected && (
        <div className="slide" style={{background:T.s2,border:`1px solid ${T.red}`,borderTop:`3px solid ${T.red}`,padding:"22px 28px",width:"100%",maxWidth:400,boxShadow:`0 8px 40px ${T.red}20`}}>
          {selected==="master" ? (
            <>
              <div className="title" style={{color:T.red,fontSize:20,letterSpacing:3,marginBottom:4}}>🔐 ACESSO MESTRE</div>
              <div className="type" style={{color:T.muted,fontSize:11,marginBottom:16}}>Documento Confidencial — Uso Exclusivo do Mestre</div>
            </>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <span className="pixel" style={{color:T.red,fontSize:24}}>{sel?.num}</span>
                <div>
                  <div className="type" style={{color:T.white,fontWeight:700,fontSize:14}}>{sel?.name}</div>
                  <div className="type" style={{color:T.muted,fontSize:10}}>{sel?.talent}</div>
                </div>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="password"
            placeholder="Digite a senha..."
            value={pw}
            onChange={e=>setPw(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&attempt()}
            style={{width:"100%",marginBottom:10,fontSize:14,letterSpacing:2}}
          />
          {err&&<div className="type" style={{color:T.red,fontSize:11,marginBottom:8}}>⚠ {err}</div>}
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={attempt}>ENTRAR</Btn>
            <Btn variant="dark" onClick={()=>{setSelected(null);setErr("");setPw("");}}>CANCELAR</Btn>
          </div>
          {/* dicas de acesso removidas por configuração do sistema */}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  RULES SCREEN
// ══════════════════════════════════════════════════════════
const CHAPTERS = [
  {id:"c1",icon:"⚔️",title:"Fundamentos",content:[
    {head:"O Jogo",text:"DANGANRONPA: O Julgamento Supremo é um RPG de mesa de suspense e dedução para 4–8 jogadores + 1 Mestre. Um grupo de até 16 estudantes é forçado a participar de um Killing Game conduzido por Monokuma. Para sobreviver: descubra o assassino nos Tribunais. Para fugir: acumule Esperança suficiente. Para vencer do jeito errado: cometa o assassinato perfeito."},
    {head:"Dado Monokuma",text:"Sempre que um jogador rolar um 6 natural em qualquer teste, o Mestre pode ativar um Evento Monokuma — uma complicação ou revelação dramática inesperada."},
    {head:"Esperança ☀️ vs. Desesperança 💀",table:[
      ["Recurso","Aumenta quando…"],
      ["☀️ Esperança","Tribunal bem-sucedido, laços de amizade, descobertas positivas"],
      ["💀 Desesperança","Assassinato ocorre, acusação errada, revelação de segredos sombrios"],
    ]},
  ]},
  {id:"c2",icon:"🎭",title:"Personagem",content:[
    {head:"Atributos Base (60 pts | Mín:5 | Máx:15)",table:[
      ["Atributo","Sigla","O que representa"],
      ["Esperança","ESP","Força de vontade, resistência mental, moral"],
      ["Inteligência","INT","Raciocínio, dedução, memória, percepção"],
      ["Furtividade","FUR","Discrição, movimentação silenciosa, dissimulação"],
      ["Persuasão","PER","Convencimento, carisma, intimidação, mentira"],
      ["Resistência","RES","Físico, aguenta pressão, stamina"],
      ["Sorte","SOR","Acaso favorável, achados inesperados"],
    ]},
    {head:"Derivados (calculados automaticamente)",table:[
      ["Derivado","Fórmula"],
      ["PV Máximo","RES × 3 + 10"],
      ["PS Máximo","ESP × 3 + 10"],
      ["Iniciativa","INT + SOR"],
      ["Defesa Passiva","RES ÷ 2 (arredonda p/ baixo)"],
      ["Limite Monocoins","SOR × 5"],
    ]},
    {head:"Laços de Amizade (Nível 0–5)",table:[
      ["Nível","Nome","Benefício"],
      ["0","Desconhecidos","Nenhum"],
      ["1","Conhecidos","+1 em Persuasão com essa pessoa"],
      ["2","Amigos","Pode pedir 1 favor por sessão"],
      ["3","Amigos Próximos","+2 em testes para proteger/ajudar"],
      ["4","Confiança Plena","Pode compartilhar Segredo sem penalidade"],
      ["5","Vínculo Supremo","Habilidade especial co-desenvolvida com o Mestre"],
    ]},
  ]},
  {id:"c3",icon:"🎲",title:"Testes",content:[
    {head:"Como Fazer um Teste",text:"1. Role 1d20 → 2. Some o valor do Atributo relevante → 3. Compare ao Número Alvo (NA) definido pelo Mestre."},
    {head:"Resultados",table:[
      ["Resultado","Efeito"],
      ["Total ≥ NA + 5","Sucesso Crítico — resultado excepcional, bônus narrativo"],
      ["Total ≥ NA","Sucesso — ação bem-sucedida"],
      ["Total = NA−1 ou NA−2","Sucesso Parcial — funciona, mas com custo ou complicação"],
      ["Total < NA−2","Falha — ação falha, pode ter consequência"],
      ["1 natural","Falha Catastrófica — algo vai muito errado"],
    ]},
    {head:"Números Alvo de Referência",table:[
      ["Dificuldade","NA","Exemplo"],
      ["Fácil","10","Notar algo óbvio, mentira simples"],
      ["Médio","15","Encontrar pista escondida, convencer alguém incerto"],
      ["Difícil","20","Investigar cena apagada, enganar alguém desconfiado"],
      ["Supremo","25","Descoberta brilhante, manipulação perfeita"],
      ["Quase Impossível","30","Feito digno de um Supremo lendário"],
    ]},
    {head:"Vantagem e Desvantagem",text:"Vantagem: Role 2d20, use o maior. Concedida por preparação, equipamentos, laços de amizade.\nDesvantagem: Role 2d20, use o menor. Concedida por trauma, ferimento, falta de informação.\nTestes Opostos: Ambos rolam 1d20 + atributo. Vence o maior total. Empate: vence o Defensor."},
  ]},
  {id:"c4",icon:"🗺️",title:"Fases do Jogo",content:[
    {head:"Estrutura de uma Rodada",text:"[1] VIDA COTIDIANA\n↓ (Monokuma entrega Motivo)\n[2] FREE TIME / TENSÃO\n↓ (assassinato acontece OU não)\n[3] DESCOBERTA DO CORPO\n↓\n[4] INVESTIGAÇÃO (tempo limitado)\n↓\n[5] TRIBUNAL DE CLASSE\n↓ (execução OU sobrevivência)"},
    {head:"Motivos de Monokuma (d8)",table:[
      ["d8","Motivo"],
      ["1","Segredo Revelado — Monokuma vai expor o segredo de alguém"],
      ["2","Memória Apagada — Quer recuperar memória? Mate alguém"],
      ["3","Chantagem — Fotos/vídeos comprometedores enviados a familiares"],
      ["4","Dívida de Esperança — Se ninguém matar em 72h, alguém morre aleatório"],
      ["5","Recompensa — O assassino ganha um item lendário"],
      ["6","Ameaça Direta — Alguém recebe mensagem: 'mate X ou eu o mato'"],
      ["7","Rivalidade — Dois estudantes têm objetivos incompatíveis"],
      ["8","Motivo do Mestre — Personalizado"],
    ]},
    {head:"Free Time — Ações (2 por período)",table:[
      ["Ação","Custo","Efeito"],
      ["Conversar","Grátis","Testa Laço com outro estudante; +1 de Laço em Sucesso"],
      ["Dar Presente","1–3 Monocoins","+1 ou +2 de Laço, dependendo do presente"],
      ["Treinar","Grátis","+1 temporário em um Atributo até o próximo Tribunal"],
      ["Explorar","Grátis","Descobre um novo cômodo/área do mapa"],
      ["Planejar Crime","Grátis (secreto)","Elabora etapas do assassinato com o Mestre"],
      ["Descansar","Grátis","Recupera 1d6 PS"],
    ]},
  ]},
  {id:"c5",icon:"🔪",title:"Assassinato",content:[
    {head:"Etapas do Assassinato",text:"PLANEJAR (alvo + método + local + janela de tempo + álibi) → EXECUTAR (testes conforme o método) → COBRIR (até 3 ações de cobertura)"},
    {head:"Tipos de Execução",table:[
      ["Método","Teste","Detalhes"],
      ["Confronto Direto","RES vs RES (Oposto)","Se vencer: sucesso. Se perder: vítima escapa e pode gritar."],
      ["Veneno/Armadilha","INT (NA 15–20) + FUR (NA 15)","Vítima faz Teste SOR para notar algo errado"],
      ["Emboscada","FUR vs INT (Oposto)","Se vencer: ataque surpresa, vítima não resiste na rodada inicial"],
    ]},
    {head:"Ações de Cobertura (máx. 3)",table:[
      ["Ação","Teste","Efeito"],
      ["Apagar Rastros de Sangue","FUR NA 18","Remove 1 Pista Física da cena"],
      ["Criar Pista Falsa","INT NA 20","Adiciona 1 Pista Enganosa à cena"],
      ["Forjar Álibi","PER NA 18","Cria testemunho fabricado com NPC"],
      ["Esconder Arma","FUR NA 15","Arma não aparece na investigação inicial"],
      ["Mover o Corpo","RES NA 15","Corpo encontrado em local diferente do crime"],
    ]},
  ]},
  {id:"c6",icon:"🔍",title:"Investigação",content:[
    {head:"Zonas de Investigação",text:"O Mestre divide o mapa em Zonas. Cada zona pode ser investigada uma vez por jogador. Declare a zona → Teste de INT (NA 12–18) → encontre pistas conforme o resultado."},
    {head:"Resultado da Investigação",table:[
      ["Resultado do Teste","Pistas Encontradas"],
      ["Falha","Nenhuma pista, ou pista falsa plantada pelo assassino"],
      ["Sucesso Parcial","1 pista menor (pode ser ambígua)"],
      ["Sucesso","1–2 pistas relevantes"],
      ["Sucesso Crítico","2–3 pistas, incluindo uma pista oculta"],
    ]},
    {head:"Tipos de Pistas",table:[
      ["Tipo","Cor","Descrição"],
      ["🔵 Física","Azul","Objeto tangível (faca, copo, tecido)"],
      ["🟡 Temporal","Amarelo","Indica horário (alarme, câmera, cardápio)"],
      ["🟢 Testemunhal","Verde","Relato de NPC ou outro estudante"],
      ["🔴 Emocional","Vermelho","Pista psicológica (carta, diário, motivação)"],
      ["⚫ Falsa","Preto","Plantada pelo assassino (o jogador não sabe)"],
    ]},
    {head:"Força das Balas de Verdade",table:[
      ["Força","Tipo","Efeito no Tribunal"],
      ["⭐","Pista menor, ambígua","Levanta dúvida"],
      ["⭐⭐","Pista direta, circunstancial","Força uma explicação"],
      ["⭐⭐⭐","Pista forte, específica","Destrói um argumento"],
      ["⭐⭐⭐⭐","Prova conclusiva","Pode encerrar um debate"],
    ]},
  ]},
  {id:"c7",icon:"⚖️",title:"Tribunal",content:[
    {head:"Estrutura do Tribunal",text:"[1] ABERTURA (suspeitas secretas) → [2] DEBATE LIVRE (15 min reais) → [3] NONSTOP DEBATE (Balas de Verdade) → [4] ACUSAÇÃO FINAL → [5] VOTAÇÃO"},
    {head:"Nonstop Debate — Regras",text:"1. O Mestre apresenta 4–6 Declarações — afirmações dos suspeitos sobre o crime.\n2. Cada Declaração tem uma Fraqueza.\n3. Em ordem de Iniciativa: atirar Bala, apoiar Declaração ou passar.\n\nTiro de Bala: 'Uso [Bala] contra [Declaração X]' → Teste INT (NA = 10 + Força × 3)\nSucesso: Declaração destruída. Falha: Bala desperdiçada."},
    {head:"Resultado da Votação",table:[
      ["Cenário","Resultado"],
      ["Maioria vota ☝ e está CERTA","Assassino executado. +3 Esperança. Próxima fase começa."],
      ["Maioria vota ☝ mas está ERRADA","Assassino escapa! Monokuma executa inocente aleatório. −5 Esperança"],
      ["Empate","Monokuma escolhe aleatoriamente um suspeito para executar"],
      ["Maioria vota 👎","Ninguém executado. −2 Esperança. Assassino fica livre para matar novamente."],
    ]},
    {head:"Bônus de Performance (Monocoins)",table:[
      ["Conquista","Monocoins"],
      ["Fez a Acusação Final correta","+5"],
      ["Destruiu 3+ Declarações com Balas","+3"],
      ["Mentiu convincentemente por 2+ rodadas (assassino)","+3"],
      ["Descobriu a Pista Decisiva","+4"],
      ["Não perdeu nenhuma Bala durante o debate","+2"],
      ["Mudou o rumo do Tribunal com 1 argumento","+2"],
    ]},
  ]},
  {id:"c8",icon:"🏆",title:"Vitória e Derrota",content:[
    {head:"Vitórias Individuais",table:[
      ["Condição","Tipo de Vitória"],
      ["Sobreviver até o fim do Killing Game","Vitória de Sobrevivência"],
      ["Cometer um assassinato perfeito e fugir","Vitória do Assassino"],
      ["Descobrir o assassino em todos os Tribunais","Vitória do Detetive"],
      ["Acumular 30+ Monocoins","Vitória de Fortuna"],
    ]},
    {head:"Vitória Coletiva",text:"O grupo pode vencer coletivamente se:\n• A Esperança global atingir 50\n• Descobrirem o 'segredo do Killing Game' (gatilho narrativo do Mestre)\n• Confrontarem Monokuma com evidências de sua fraqueza"},
    {head:"Derrota Coletiva",text:"O grupo perde se:\n• Restar apenas 1 estudante vivo (sem ter descoberto o segredo)\n• A Desesperança global atingir 50\n• Um assassino escapar impune 3 vezes seguidas"},
  ]},
];

function RulesScreen({onBack}) {
  const [activeChapter, setActiveChapter] = useState("c1");
  const chapter = CHAPTERS.find(c=>c.id===activeChapter);
  const [dice, setDice] = useState(null);
  const [attr, setAttr] = useState(10);

  const rollDice = () => {
    const r = Math.floor(Math.random()*20)+1;
    setDice({roll:r,total:r+attr,nat:(r===1||r===20)});
  };

  return (
    <div className="fade" style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      {/* TOP BAR */}
      <div style={{background:T.s1,borderBottom:`1px solid ${T.bd}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:100}}>
        <Btn variant="ghost" onClick={onBack} style={{fontSize:11}}>← VOLTAR</Btn>
        <div>
          <span className="title" style={{color:T.red,fontSize:20,letterSpacing:3}}>MANUAL DE REGRAS</span>
          <span className="type" style={{color:T.muted,fontSize:10,marginLeft:10}}>DANGANRONPA: O JULGAMENTO SUPREMO v1.0</span>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",height:"calc(100vh - 52px)"}}>
        {/* SIDEBAR */}
        <div style={{width:200,background:T.s1,borderRight:`1px solid ${T.bd}`,padding:"16px 0",overflowY:"auto",flexShrink:0}}>
          {CHAPTERS.map(c=>(
            <div key={c.id} onClick={()=>setActiveChapter(c.id)}
              style={{padding:"10px 16px",cursor:"pointer",display:"flex",gap:8,alignItems:"center",
                borderLeft:`3px solid ${activeChapter===c.id?T.red:"transparent"}`,
                background:activeChapter===c.id?T.s2:"transparent",
                color:activeChapter===c.id?T.white:T.muted,transition:"all .15s"}}>
              <span style={{fontSize:14}}>{c.icon}</span>
              <span className="type" style={{fontSize:11,letterSpacing:.5}}>{c.title}</span>
            </div>
          ))}
          {/* DICE ROLLER */}
          <div style={{margin:"20px 12px 0",background:T.s2,border:`1px solid ${T.bd}`,padding:"12px",borderRadius:2}}>
            <div className="title" style={{color:T.yellow,fontSize:12,letterSpacing:2,marginBottom:10}}>🎲 ROLAR DADO</div>
            <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>Valor do Atributo:</div>
            <input type="number" min={1} max={20} value={attr} onChange={e=>setAttr(+e.target.value)}
              style={{width:"100%",marginBottom:8,textAlign:"center"}}/>
            <Btn onClick={rollDice} style={{width:"100%",marginBottom:8,textAlign:"center"}}>ROLAR 1d20</Btn>
            {dice&&(
              <div style={{textAlign:"center"}}>
                <div className="pixel" style={{fontSize:36,color:dice.nat&&dice.roll===20?T.yellow:dice.nat&&dice.roll===1?T.red:T.white,lineHeight:1}}>{dice.roll}</div>
                <div className="type" style={{fontSize:10,color:T.muted}}>1d20</div>
                <div className="pixel" style={{fontSize:24,color:T.yellow}}>={dice.total}</div>
                {dice.roll===20&&<div style={{color:T.yellow,fontSize:10,marginTop:4}}>★ CRÍTICO!</div>}
                {dice.roll===1&&<div style={{color:T.red,fontSize:10,marginTop:4}}>💀 CATASTRÓFICO!</div>}
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          <div className="slide">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <span style={{fontSize:28}}>{chapter.icon}</span>
              <div>
                <div className="title" style={{fontSize:28,color:T.white,letterSpacing:3}}>{chapter.title}</div>
                <div style={{borderBottom:`2px solid ${T.red}`,width:60,marginTop:4}}/>
              </div>
            </div>
            {chapter.content.map((sec,i)=>(
              <div key={i} style={{marginBottom:24}}>
                <div className="title" style={{color:T.yellow,fontSize:14,letterSpacing:2,marginBottom:8}}>{sec.head}</div>
                {sec.text&&(
                  <div className="type" style={{color:T.muted,fontSize:12,lineHeight:1.8,whiteSpace:"pre-line",
                    background:T.s2,border:`1px solid ${T.bd}`,padding:"12px 14px",borderLeft:`3px solid ${T.bd2}`}}>
                    {sec.text}
                  </div>
                )}
                {sec.table&&(
                  <div style={{overflowX:"auto"}}>
                    <table>
                      <thead>
                        <tr>{sec.table[0].map((h,j)=><th key={j}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {sec.table.slice(1).map((row,j)=>(
                          <tr key={j}>
                            {row.map((cell,k)=>(
                              <td key={k} className="type" style={{color:k===0?T.white:T.muted,fontWeight:k===0?700:400}}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* imagem modal removido daqui — agora renderizado na ficha do personagem */}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  CHARACTER SCREEN
// ══════════════════════════════════════════════════════════
function CharacterScreen({char,onBack}) {
  const d = derive(char.attrs);
  const [status, setStatus] = usePersist(PERSIST_KEYS.charStatus(char.id), {pv:d.pvMax,ps:d.psMax,coins:0});
  const [bonds, setBonds] = usePersist(PERSIST_KEYS.charBonds(char.id), CHARS.filter(c=>c.id!==char.id).map(c=>({id:c.id,name:c.name,lvl:(char.bonds.find(bb=>bb.name===c.name)?.lvl??0)})));
  // migrate older numeric-only bonds to object form
  useEffect(()=>{
    if(Array.isArray(bonds) && bonds.length && typeof bonds[0] === 'number'){
      setBonds(CHARS.filter(c=>c.id!==char.id).map((c,i)=>({id:c.id,name:c.name,lvl:bonds[i]||0})));
    }
  }, [char.id]);
  const [clues, setClues] = usePersist(PERSIST_KEYS.charClues(char.id), []);
  const [notes, setNotes] = usePersist(PERSIST_KEYS.charNotes(char.id), "");
  const [tribunal, setTribunal] = usePersist(PERSIST_KEYS.charTribunal(char.id),
    {suspect:"",evidence:"",accusation:"",votes:"",phase:"",notes:""});
  const [tab, setTab] = useState("ficha");
  const [showAddClue, setShowAddClue] = useState(false);
  const [newClue, setNewClue] = useState({name:"",type:"fisica",force:"⭐",desc:"",status:"disponivel"});
  const [memoriesUnlocked, setMemoriesUnlocked] = usePersist(PERSIST_KEYS.charMemories(char.id), false);
  const [memCode, setMemCode] = useState("");
  const [memErr, setMemErr] = useState("");
  const [showMemUnlock, setShowMemUnlock] = useState(false);
  const [lockedUnlocked, setLockedUnlocked] = usePersist(PERSIST_KEYS.charLocked(char.id), false);
  const [lockCode, setLockCode] = useState("");
  const [lockErr, setLockErr] = useState("");
  const [showLockInput, setShowLockInput] = useState(false);
  const lockedMem = LOCKED_MEMORIES[char.id];
  const LOCK_CODE = LOCK_CODES[char.id] || String(char.id).padStart(2,"0");
  const [charImage, setCharImage] = usePersist(PERSIST_KEYS.charImage(char.id), "");
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const rb = ROLE_BADGE.player;
  const { isMobile } = useViewport();

  // se houver imagem definida no CHARS, inicializa o estado persistente com ela
  useEffect(()=>{
    if(!charImage) {
      const fallback = char.image || `img/${String(char.id).padStart(2,'0')}.jpeg`;
      setCharImage(fallback);
    }
  }, [char, charImage, setCharImage]);


  const copyPrompt = () => {
    const p = CHAR_PROMPTS[char.id] || "";
    navigator.clipboard?.writeText(p).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false), 2200);
    }).catch(()=>{ setCopied(true); setTimeout(()=>setCopied(false), 2200); });
  };

  const adjStatus = (field, delta) => {
    setStatus(prev=>({...prev,[field]:Math.max(0,Math.min(field==="pv"?d.pvMax:field==="ps"?d.psMax:d.coinsMax,prev[field]+delta))}));
  };

  const TABS = [
    {id:"ficha",label:"📋 FICHA"},
    {id:"clues",label:"🔍 PISTAS"},
    {id:"tribunal",label:"⚖️ TRIBUNAL"},
    {id:"notas",label:"📝 NOTAS"},
  ];

  return (<>
    <div className="fade" style={{minHeight:"100vh",background:T.bg}}>
      {/* HEADER */}
      <div style={{background:T.s1,borderBottom:`3px solid ${T.red}`,padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span className="pixel" style={{color:T.red,fontSize:28}}>{char.num}</span>
              <div>
                <div className="title" style={{fontSize:22,color:T.white,letterSpacing:2,lineHeight:1}}>{char.name}</div>
                <div className="type" style={{color:T.muted,fontSize:10}}>{char.talent}</div>
              </div>
              <Badge bg={rb.bg} color={rb.text}>{rb.label}</Badge>
              {char.age&&<span className="type" style={{color:T.dim,fontSize:11}}>{char.age} anos • {char.pro}</span>}
            </div>
          </div>
          <Btn variant="ghost" onClick={onBack} style={{fontSize:11}}>← SAIR</Btn>
        </div>

        {/* STATUS BARS - compact */}
        <div style={{display:"flex",gap:20,marginTop:12,flexWrap:"wrap"}}>
          <StatBar label="PV — Pontos de Vida" cur={status.pv} max={d.pvMax} color={T.greenL}
            onPlus={()=>adjStatus("pv",1)} onMinus={()=>adjStatus("pv",-1)}/>
          <StatBar label="PS — Pontos de Sanidade" cur={status.ps} max={d.psMax} color={T.blue}
            onPlus={()=>adjStatus("ps",1)} onMinus={()=>adjStatus("ps",-1)}/>
          <div style={{minWidth:120}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span className="type" style={{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase"}}>🪙 Monocoins</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>adjStatus("coins",-1)} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:1}}>−</button>
                <span className="pixel" style={{color:T.yellow,fontSize:22,lineHeight:1}}>{status.coins}<span style={{color:T.muted,fontSize:12}}>/{d.coinsMax}</span></span>
                <button onClick={()=>adjStatus("coins",1)} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:1}}>+</button>
              </div>
            </div>
            <div style={{background:T.s4,height:6,borderRadius:1}}>
              <div style={{height:"100%",width:`${(status.coins/d.coinsMax)*100}%`,background:T.yellow,transition:"width .3s"}}/>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:2,marginTop:14}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{background:tab===t.id?T.red:T.s3,color:tab===t.id?T.white:T.muted,
                border:"none",padding:"7px 16px",fontSize:11,letterSpacing:.5,transition:"all .15s",cursor:"pointer"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"20px",maxWidth:900,margin:"0 auto"}}>

        {/* ─── TAB: FICHA ───────────────────────────────── */}
        {tab==="ficha"&&(
          <div className="slide">
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"190px 1fr 1fr",gap:14,marginBottom:14}}>
              {/* ── PORTRAIT IMAGE CARD ───────────────────── */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {/* Image area */}
                <div onClick={()=>setShowImageModal(true)}
                  style={{background:T.s3,border:`1px solid ${charImage?T.bd2:T.bd}`,
                    borderStyle:charImage?"solid":"dashed",
                    width:"100%",aspectRatio:"3/4",display:"flex",
                    flexDirection:"column",alignItems:"center",justifyContent:"center",
                    cursor:"pointer",overflow:"hidden",position:"relative",
                    transition:"border-color .2s"}}>
                  {charImage ? (
                    <>
                      <img src={charImage} alt={char.name}
                        style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,
                        background:"linear-gradient(transparent,rgba(0,0,0,.7))",
                        padding:"20px 8px 6px",display:"flex",justifyContent:"center"}}>
                        <span className="type" style={{color:"rgba(255,255,255,.7)",fontSize:9,letterSpacing:1}}>
                          CLIQUE PARA AMPLIAR
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{textAlign:"center",padding:12}}>
                      <div style={{fontSize:32,marginBottom:8,opacity:.4}}>🖼</div>
                      <div className="type" style={{color:T.dim,fontSize:10,lineHeight:1.5}}>
                        Imagem disponível apenas na ficha
                      </div>
                    </div>
                  )}
                </div>

                {imgErr&&<div className="type" style={{color:T.red,fontSize:9}}>{imgErr}</div>}

                {/* Prompt IA button removed per request (images are now linked directly to characters) */}

                {/* Remove image if exists */}
                {/* Remoção/alteração de imagem desativada */}
              </div>
              {/* IDENTITY */}
              <Card>
                <SectionTitle icon="🎭">Identidade</SectionTitle>
                <div style={{background:T.s3,padding:"10px 12px",borderLeft:`3px solid ${T.bd2}`,marginBottom:10}}>
                  <div className="type" style={{color:T.muted,fontSize:10,marginBottom:4}}>APARÊNCIA</div>
                  <div className="type" style={{color:T.white,fontSize:12,lineHeight:1.7}}>{char.appear}</div>
                </div>
                <div style={{background:T.s3,padding:"10px 12px",borderLeft:`3px solid ${T.yellow}`}}>
                  <div className="type" style={{color:T.muted,fontSize:10,marginBottom:4}}>MOTIVAÇÃO</div>
                  <div className="type" style={{color:T.white,fontSize:12,lineHeight:1.7}}>
                    {char.isMastermind && memoriesUnlocked
                      ? char.motivation.split("[REAL]")[1]?.trim() || char.motivation
                      : char.motivation.split("\n[REAL]")[0].replace("[APARENTE]","").trim()}
                  </div>
                </div>
              </Card>

              {/* ATTRIBUTES */}
              <Card>
                <SectionTitle icon="⚡">Atributos</SectionTitle>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  {Object.entries(char.attrs).map(([k,v])=>(
                    <div key={k} style={{background:T.s3,padding:"8px 10px",textAlign:"center",border:`1px solid ${T.bd}`}}>
                      <div className="type" style={{color:T.muted,fontSize:9,letterSpacing:1}}>{k}</div>
                      <div className="pixel" style={{color:T.yellow,fontSize:28,lineHeight:1}}>{v}</div>
                    </div>
                  ))}
                </div>
                <SectionTitle icon="📐">Derivados</SectionTitle>
                <table>
                  <tbody>
                    {[
                      ["PV Máximo", d.pvMax, "RES×3+10"],
                      ["PS Máximo", d.psMax, "ESP×3+10"],
                      ["Iniciativa", d.init, "INT+SOR"],
                      ["Defesa Passiva", d.def, "RES÷2"],
                      ["Lim. Monocoins", d.coinsMax, "SOR×5"],
                    ].map(([l,v,f])=>(
                      <tr key={l}>
                        <td className="type" style={{color:T.white,fontSize:12}}>{l}</td>
                        <td className="pixel" style={{color:T.yellow,fontSize:20,textAlign:"right"}}>{v}</td>
                        <td className="type" style={{color:T.dim,fontSize:10,textAlign:"right"}}>↳ {f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* ABILITY + WEAKNESS */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <Card style={{borderLeft:`3px solid ${T.yellow}`}}>
                <SectionTitle icon="✨" color={T.yellow}>Habilidade Especial</SectionTitle>
                <div className="title" style={{color:T.yellow,fontSize:15,letterSpacing:2,marginBottom:6}}>
                  {char.isMastermind && memoriesUnlocked ? char.abilityReal.name : char.ability.name}
                </div>
                <div className="type" style={{color:T.muted,fontSize:12,lineHeight:1.7}}>
                  {char.isMastermind && memoriesUnlocked ? char.abilityReal.desc : char.ability.desc}
                </div>
              </Card>
              <Card style={{borderLeft:`3px solid ${T.red}`}}>
                <SectionTitle icon="⚠️" color={T.red}>Fraqueza do Talento</SectionTitle>
                <div className="type" style={{color:T.muted,fontSize:12,lineHeight:1.7}}>{char.weakness}</div>
              </Card>
            </div>

            {/* BONDS */}
            <Card>
              <SectionTitle icon="💛">Laços de Amizade</SectionTitle>
              <table>
                <thead>
                  <tr>
                    <th>Personagem</th>
                    <th>Nível</th>
                    <th>Benefício</th>
                    <th style={{textAlign:"right"}}>Ajustar</th>
                  </tr>
                </thead>
                <tbody>
                  {bonds.map((b,i)=>{
                      const lvl = b.lvl??0;
                      const benefits=["Nenhum","+1 PER","1 favor/sessão","+2 p/ proteger","Confiança Plena","Vínculo Supremo"];
                      return (
                        <tr key={b.id||i}>
                          <td className="type" style={{color:T.white,fontWeight:700}}>
                            <input value={b.name} onChange={e=>setBonds(prev=>{const np=[...prev];np[i]={...np[i],name:e.target.value};return np;})}
                              style={{background:"transparent",border:"none",color:T.white,fontSize:12,width:"100%"}}/>
                          </td>
                          <td>
                            <div style={{display:"flex",gap:2}}>
                              {[0,1,2,3,4,5].map(n=>(
                                <div key={n} style={{width:14,height:14,borderRadius:"50%",
                                  background:n<=lvl?T.yellow:T.s4,border:`1px solid ${n<=lvl?T.yellowD:T.bd}`,cursor:"pointer"}}
                                  onClick={()=>setBonds(prev=>{const np=[...prev];np[i]={...np[i],lvl:n};return np;})}/>
                              ))}
                            </div>
                          </td>
                          <td className="type" style={{color:T.muted,fontSize:11}}>{benefits[lvl]||"Nenhum"}</td>
                          <td style={{textAlign:"right"}}>
                            <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                              <button onClick={()=>setBonds(prev=>{const np=[...prev];np[i]={...np[i],lvl:Math.max(0,(np[i]?.lvl??0)-1)};return np;})}
                                style={{background:T.s4,border:"none",color:T.white,padding:"2px 8px",cursor:"pointer",fontSize:12}}>−</button>
                              <span className="pixel" style={{color:T.yellow,fontSize:18,minWidth:20,textAlign:"center"}}>{lvl}</span>
                              <button onClick={()=>{console.log('[BOND-CLICK] + for bond', i); setBonds(prev=>{const np=[...prev];np[i]={...np[i],lvl:Math.min(5,(np[i]?.lvl??0)+1)};console.log('[BOND-SET] new bonds:', JSON.stringify(np).substring(0,100));return np;})}}
                                style={{background:T.s4,border:"none",color:T.white,padding:"2px 8px",cursor:"pointer",fontSize:12}}>+</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div style={{marginTop:10,padding:"8px 10px",background:T.s3,fontSize:10,color:T.dim}}>
                <span className="type">Nível 0: Desconhecidos | 1: Conhecidos (+1 PER) | 2: Amigos (1 favor) | 3: Próximos (+2) | 4: Confiança Plena | 5: Vínculo Supremo</span>
              </div>
            </Card>

            {/* ── LOCKED MEMORY CARD (todos os personagens) ── */}
            {lockedMem && (
              <div style={{marginTop:16}}>
                {!lockedUnlocked && !showLockInput && (
                  <Btn onClick={()=>setShowLockInput(true)}
                    style={{background:"#1a1430",color:"#9070c8",border:"1px solid #4a3080",fontSize:11}}>
                    🧠 INSERIR CÓDIGO DE RECUPERAÇÃO
                  </Btn>
                )}

                {!lockedUnlocked && showLockInput && (
                  <div>
                    <div className="type" style={{fontSize:10,color:T.muted,marginBottom:6}}>
                      Código de recuperação de memória:
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <input type="password" value={lockCode}
                        onChange={e=>setLockCode(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==="Enter"){
                            if(lockCode.trim()===LOCK_CODE){setLockedUnlocked(true);setShowLockInput(false);setLockErr("");}
                            else setLockErr("Código inválido.");
                          }
                        }}
                        placeholder="Código do Mestre..." style={{flex:1,letterSpacing:4}}/>
                      <Btn onClick={()=>{
                        if(lockCode.trim()===LOCK_CODE){setLockedUnlocked(true);setShowLockInput(false);setLockErr("");}
                        else setLockErr("Código inválido. Aguarde o momento certo.");
                      }} style={{background:"#1a1430",color:"#9070c8",border:"1px solid #4a3080",fontSize:11}}>
                        DESBLOQUEAR
                      </Btn>
                    </div>
                    {lockErr&&<div className="type" style={{color:T.red,fontSize:11,marginTop:6}}>⚠ {lockErr}</div>}
                  </div>
                )}

                {lockedUnlocked && (
                  <div className="slide" style={{background:"#0e0d20",border:`1px solid #5040a0`,borderTop:`3px solid #9070e0`,padding:"20px",boxShadow:`0 0 30px #6040a015`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                      <span style={{fontSize:22}}>🔓</span>
                      <div>
                        <div className="type" style={{color:"#7060b0",fontSize:9,letterSpacing:2,marginBottom:2}}>MEMÓRIA RECUPERADA</div>
                        <div className="title" style={{color:"#c0a8ff",fontSize:18,letterSpacing:3}}>{lockedMem.title}</div>
                      </div>
                    </div>
                    <div style={{background:"#120f22",border:`1px solid #3a2a60`,borderLeft:`3px solid #8060d0`,padding:"14px 16px"}}>
                      <div className="type" style={{color:"#d0c0f8",fontSize:13,lineHeight:1.9,whiteSpace:"pre-line"}}>{lockedMem.content}</div>
                    </div>
                    <div className="type" style={{color:T.dim,fontSize:10,marginTop:10,textAlign:"right"}}>Esta memória foi suprimida antes da sua entrada na Academy.</div>
                  </div>
                )}
              </div>
            )}

            {/* ── MASTERMIND MEMORIES SECTION ───────────── */}
            {char.isMastermind && !memoriesUnlocked && (
              <div className="pulse" style={{marginTop:16,background:"#0a0a14",border:`1px solid #2a1a2e`,borderTop:`2px solid #44224e`,padding:"20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{fontSize:28}}>🔒</div>
                  <div>
                    <div className="title" style={{color:"#a060c0",fontSize:16,letterSpacing:3}}>MEMÓRIAS SUPRIMIDAS</div>
                    <div className="type" style={{color:T.dim,fontSize:11}}>Há algo bloqueado nas suas memórias. O Mestre pode liberar acesso.</div>
                  </div>
                </div>
                {!showMemUnlock ? (
                  <Btn onClick={()=>setShowMemUnlock(true)} style={{background:"#2a1040",color:"#c090e0",border:"1px solid #6030a0",fontSize:12}}>
                    🧠 RECUPERAR MEMÓRIAS
                  </Btn>
                ) : (
                  <div>
                    <div className="type" style={{fontSize:11,color:T.muted,marginBottom:6}}>Código de recuperação (fornecido pelo Mestre):</div>
                    <div style={{display:"flex",gap:8}}>
                      <input type="password" value={memCode} onChange={e=>setMemCode(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&(()=>{
                          if(memCode.trim().toLowerCase()===LOCK_CODE.toLowerCase()){setMemoriesUnlocked(true);setShowMemUnlock(false);setMemErr("");}
                          else{setMemErr("Código inválido. Consulte o Mestre.");}
                        })()}
                        placeholder="Código secreto..." style={{flex:1,letterSpacing:3}}/>
                      <Btn onClick={()=>{
                        if(memCode.trim().toLowerCase()===LOCK_CODE.toLowerCase()){setMemoriesUnlocked(true);setShowMemUnlock(false);setMemErr("");}
                        else setMemErr("Código inválido. Consulte o Mestre.");
                      }} style={{background:"#2a1040",color:"#c090e0",border:"1px solid #6030a0",fontSize:12}}>ATIVAR</Btn>
                    </div>
                    {memErr&&<div className="type" style={{color:T.red,fontSize:11,marginTop:6}}>⚠ {memErr}</div>}
                  </div>
                )}
              </div>
            )}

            {char.isMastermind && memoriesUnlocked && (
              <div className="slide" style={{marginTop:16}}>
                {/* TRUE IDENTITY BANNER */}
                <div style={{background:"#150520",border:`1px solid #8030b0`,borderTop:`3px solid #c060e0`,
                  padding:"18px 20px",marginBottom:14,boxShadow:`0 0 30px #8030b020`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:24}}>★</span>
                    <div>
                      <div className="type" style={{color:"#c060e0",fontSize:9,letterSpacing:2,marginBottom:2}}>MEMÓRIAS RECUPERADAS — IDENTIDADE REAL</div>
                      <div className="title" style={{color:"#e090ff",fontSize:22,letterSpacing:3}}>SUPREMA ARQUITETA DE DESESPERO</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div style={{background:"#1a0a28",padding:"10px 12px",borderLeft:`2px solid #c060e0`}}>
                      <div className="type" style={{color:"#9050c0",fontSize:9,letterSpacing:1.5,marginBottom:4}}>TALENTO REAL</div>
                      <div className="type" style={{color:"#e090ff",fontSize:12,lineHeight:1.6,fontWeight:700}}>Suprema Arquiteta de Desespero. Este é seu terceiro Killing Game projetado. Seu talento de Orientadora é uma capa criada para infiltração.</div>
                    </div>
                    <div style={{background:"#1a0a28",padding:"10px 12px",borderLeft:`2px solid #f0b030`}}>
                      <div className="type" style={{color:"#c08020",fontSize:9,letterSpacing:1.5,marginBottom:4}}>MOTIVAÇÃO REAL</div>
                      <div className="type" style={{color:"#f0e0a0",fontSize:12,lineHeight:1.6}}>Coletar evidências sobre a Turma 66 para chantagear a organização e se libertar do papel de Mastermind. Você está começando a questionar tudo.</div>
                    </div>
                    <div style={{background:"#1a0a28",padding:"10px 12px",borderLeft:`2px solid #30a0c0`,gridColumn:"1/-1"}}>
                      <div className="type" style={{color:"#2080a0",fontSize:9,letterSpacing:1.5,marginBottom:4}}>HABILIDADE OCULTA — ARQUITETA DO CAOS</div>
                      <div className="type" style={{color:"#80d0f0",fontSize:12,lineHeight:1.7}}>Uma vez por caso, pode revelar uma câmera oculta que "descobriu por acidente" — na verdade você sabia o tempo todo. Concede pista ⭐⭐ ao grupo. Você tem ACESSO: quarto de controle de Monokuma, mapa completo com câmeras ocultas, e conhece os Segredos de todos os 16 estudantes (entregues pela organização antes do início).</div>
                    </div>
                  </div>
                </div>

                {/* ALL STUDENTS SECRETS */}
                <div style={{background:T.s2,border:`1px solid #3a1a4a`,padding:"16px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <span style={{fontSize:16}}>📂</span>
                    <div className="title" style={{color:"#c060e0",fontSize:14,letterSpacing:2}}>DOSSIÊ COMPLETO — SEGREDOS DA TURMA 67</div>
                    <div style={{flex:1,borderTop:`1px solid #3a1a4a`,marginLeft:6}}/>
                  </div>
                  <div className="type" style={{color:T.dim,fontSize:10,marginBottom:12}}>
                    A organização te forneceu estes arquivos antes de você entrar. Você conhece o segredo de cada estudante.
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {CHARS.filter(c=>c.id!==16).map(c=>(
                      <div key={c.id} style={{background:T.s3,border:`1px solid ${T.bd}`,borderLeft:`2px solid #5a2a6a`,padding:"8px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                        <span className="pixel" style={{color:"#c060e0",fontSize:16,flexShrink:0,lineHeight:1.2}}>{c.num}</span>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                            <span className="type" style={{color:T.white,fontWeight:700,fontSize:11}}>{c.name}</span>
                            <span className="type" style={{color:T.dim,fontSize:9}}>— {c.talent}</span>
                          </div>
                          <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.6}}>{c.secret}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MASTERMIND GUIDE */}
                <div style={{marginTop:14,background:"#0f0018",border:`1px solid #5a2070`,padding:"14px 16px"}}>
                  <div className="title" style={{color:"#a050d0",fontSize:12,letterSpacing:2,marginBottom:8}}>⚠ GUIA DO MASTERMIND</div>
                  <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.9,whiteSpace:"pre-line"}}>
{`• Você conhece todos os Segredos. Use isso sutilmente para redirecionar suspeitas sem revelar que sabe.
• NUNCA cometa assassinatos diretamente — apenas plante os Motivos. O caos deve parecer natural.
• Nos Tribunais, ajude genuinamente a encontrar o assassino — assassinatos fora do seu controle ameaçam o jogo.
• Seu maior medo: ser descoberta por Izumi — porque precisaria eliminá-la ou revelar a verdade.
• Se os jogadores reunirem 4+ pistas que apontem para você antes do Caso Final, entregue voluntariamente evidências da organização em troca de imunidade.
• REVELAÇÃO DRAMÁTICA: Quando a máscara cair, chore de verdade — não por ser pega, mas pelo que foi forçada a construir.`}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: PISTAS ───────────────────────────────── */}
        {tab==="clues"&&(
          <div className="slide">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <SectionTitle icon="🔍">Balas de Verdade — Pistas Coletadas</SectionTitle>
              <Btn onClick={()=>setShowAddClue(s=>!s)} variant="yellow" style={{fontSize:11}}>+ ADICIONAR PISTA</Btn>
            </div>

            {showAddClue&&(
              <Card style={{marginBottom:16,border:`1px solid ${T.yellow}`}}>
                <SectionTitle icon="➕" color={T.yellow}>Nova Pista</SectionTitle>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div>
                    <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>NOME DA PISTA</div>
                    <input value={newClue.name} onChange={e=>setNewClue(p=>({...p,name:e.target.value}))} style={{width:"100%"}} placeholder="Ex: Faca sem sangue"/>
                  </div>
                  <div>
                    <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>TIPO</div>
                    <select value={newClue.type} onChange={e=>setNewClue(p=>({...p,type:e.target.value}))} style={{width:"100%"}}>
                      {Object.entries(CLUE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>FORÇA</div>
                    <select value={newClue.force} onChange={e=>setNewClue(p=>({...p,force:e.target.value}))} style={{width:"100%"}}>
                      {["⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐"].map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>STATUS</div>
                    <select value={newClue.status} onChange={e=>setNewClue(p=>({...p,status:e.target.value}))} style={{width:"100%"}}>
                      <option value="disponivel">🟢 Disponível</option>
                      <option value="usada">🔵 Usada</option>
                      <option value="descartada">⚫ Descartada</option>
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>DESCRIÇÃO / O QUE ESTA PISTA PROVA</div>
                  <textarea value={newClue.desc} onChange={e=>setNewClue(p=>({...p,desc:e.target.value}))}
                    style={{width:"100%",minHeight:60,resize:"vertical"}} placeholder="Descreva o que esta pista significa ou prova..."/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn variant="yellow" onClick={()=>{
                    if(newClue.name){
                      setClues(p=>[...p,{...newClue,id:Date.now()}]);
                      setNewClue({name:"",type:"fisica",force:"⭐",desc:"",status:"disponivel"});
                      setShowAddClue(false);
                    }
                  }}>SALVAR PISTA</Btn>
                  <Btn variant="dark" onClick={()=>setShowAddClue(false)}>CANCELAR</Btn>
                </div>
              </Card>
            )}

            {clues.length===0?(
              <div style={{textAlign:"center",padding:"40px 20px",color:T.dim}}>
                <div style={{fontSize:32,marginBottom:8}}>🔍</div>
                <div className="type" style={{fontSize:12}}>Nenhuma pista coletada ainda.</div>
                <div className="type" style={{fontSize:11,marginTop:4}}>Adicione pistas durante a investigação.</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {clues.map((c,i)=>(
                  <div key={c.id||i} style={{background:T.s2,border:`1px solid ${T.bd}`,borderLeft:`3px solid ${CLUE_COLORS[c.type]||T.bd}`,padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        <span className="type" style={{color:T.white,fontWeight:700,fontSize:13}}>{c.name}</span>
                        <Badge bg={CLUE_COLORS[c.type]+"30"} color={CLUE_COLORS[c.type]} style={{fontSize:9}}>{CLUE_LABELS[c.type]}</Badge>
                        <span className="pixel" style={{color:T.yellow,fontSize:16}}>{c.force}</span>
                        <select value={c.status} onChange={e=>setClues(p=>p.map((cl,j)=>j===i?{...cl,status:e.target.value}:cl))}
                          style={{fontSize:10,padding:"2px 6px",width:"auto"}}>
                          <option value="disponivel">🟢 Disponível</option>
                          <option value="usada">🔵 Usada</option>
                          <option value="descartada">⚫ Descartada</option>
                        </select>
                      </div>
                      <button onClick={()=>setClues(p=>p.filter((_,j)=>j!==i))}
                        style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:14,padding:"0 4px"}}>✕</button>
                    </div>
                    {c.desc&&<div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.6}}>{c.desc}</div>}
                  </div>
                ))}
                <div style={{display:"flex",gap:16,padding:"8px 0",borderTop:`1px solid ${T.bd}`,marginTop:4}}>
                  <span className="type" style={{fontSize:11,color:T.muted}}>Total: {clues.length}</span>
                  <span className="type" style={{fontSize:11,color:T.greenL}}>🟢 Disponíveis: {clues.filter(c=>c.status==="disponivel").length}</span>
                  <span className="type" style={{fontSize:11,color:T.blue}}>🔵 Usadas: {clues.filter(c=>c.status==="usada").length}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: TRIBUNAL ───────────────────────────────── */}
        {tab==="tribunal"&&(
          <div className="slide">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card>
                <SectionTitle icon="1️⃣" color={T.blue}>Fase 1 — Suspeita Inicial</SectionTitle>
                <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>MEU SUSPEITO INICIAL</div>
                <input value={tribunal.suspect} onChange={e=>setTribunal(p=>({...p,suspect:e.target.value}))}
                  style={{width:"100%",marginBottom:8}} placeholder="Nome do suspeito..."/>
                <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>PISTA MAIS FORTE</div>
                <input value={tribunal.evidence} onChange={e=>setTribunal(p=>({...p,evidence:e.target.value}))}
                  style={{width:"100%"}} placeholder="Qual pista apoia minha suspeita..."/>
              </Card>
              <Card>
                <SectionTitle icon="4️⃣" color={T.yellow}>Fase 4 — Acusação Final</SectionTitle>
                <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>ACUSADO</div>
                <input value={tribunal.accusation} onChange={e=>setTribunal(p=>({...p,accusation:e.target.value}))}
                  style={{width:"100%",marginBottom:8}} placeholder="Nome do acusado..."/>
                <div className="type" style={{fontSize:10,color:T.muted,marginBottom:4}}>FASE 5 — MOTO DO VOTO</div>
                <input value={tribunal.votes} onChange={e=>setTribunal(p=>({...p,votes:e.target.value}))}
                  style={{width:"100%"}} placeholder="☝ Culpado ou 👎 Inocente..."/>
              </Card>
              <Card style={{gridColumn:"1/-1"}}>
                <SectionTitle icon="2️⃣" color={T.muted}>Fase 2 — Notas do Debate Livre</SectionTitle>
                <textarea value={tribunal.notes} onChange={e=>setTribunal(p=>({...p,notes:e.target.value}))}
                  style={{width:"100%",minHeight:100,resize:"vertical"}}
                  placeholder="Anotações durante os 15 minutos de debate livre..."/>
              </Card>
            </div>
            <div style={{marginTop:14,padding:"12px 14px",background:T.s2,border:`1px solid ${T.bd}`}}>
              <div className="title" style={{color:T.muted,fontSize:12,letterSpacing:2,marginBottom:8}}>REFERÊNCIA — BÔNUS MONOCOINS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {[["Acusação Final correta",5],["Destruiu 3+ Declarações",3],["Descobriu a Pista Decisiva",4],["Não perdeu nenhuma Bala",2]].map(([l,v])=>(
                  <div key={l} style={{background:T.s3,padding:"6px 10px",display:"flex",gap:8,alignItems:"center"}}>
                    <span className="pixel" style={{color:T.yellow,fontSize:18}}>+{v}</span>
                    <span className="type" style={{color:T.muted,fontSize:10}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: NOTAS ───────────────────────────────── */}
        {tab==="notas"&&(
          <div className="slide">
            <Card>
              <SectionTitle icon="📝">Notas da Sessão</SectionTitle>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                style={{width:"100%",minHeight:300,resize:"vertical",fontSize:13,lineHeight:1.8}}
                placeholder="Anotações livres sobre a sessão, teorias, pistas a investigar..."/>
            </Card>
          </div>
        )}
      </div>

      {showImageModal && (
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:12000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={()=>setShowImageModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"90vh",width:"100%",textAlign:"center"}}>
            <img src={charImage} alt={char.name} style={{maxWidth:"100%",maxHeight:"80vh",objectFit:"contain",border:`4px solid ${T.red}`}}/>
            <div style={{marginTop:12}}>
              <Btn onClick={()=>setShowImageModal(false)}>FECHAR</Btn>
            </div>
          </div>
        </div>
      )}

    </div>
  </>
  );
}

// ══════════════════════════════════════════════════════════
//  MASTER SCREEN
// ══════════════════════════════════════════════════════════
function MasterScreen({onBack}) {
  const [tab, setTab] = useState("turma");
  const [global, setGlobal] = usePersist(PERSIST_KEYS.global, {hope:0,despair:0});
  const [charStatuses, setCharStatuses] = usePersist(PERSIST_KEYS.charStatuses,
    Object.fromEntries(CHARS.map(c=>[c.id,"vivo"])));
  const [crimes, setCrimes] = usePersist(PERSIST_KEYS.crimes,
    [{},{},{},{}].map((_,i)=>({num:i+1,killer:"",victim:"",method:"",locale:"",alibi:"",cover:"",fakeclues:"",realclues:"",result:"",notes:""})));
  const [selectedChar, setSelectedChar] = useState(null);
  const [monokumaPower, setMonokumaPower] = usePersist(PERSIST_KEYS.monokumaUsed,[false,false,false,false]);
  const [sync, setSync] = useState(0);
  const fileInputRef = useRef();

  const exportState = async () => {
    try {
      const res = await serverFetch(`/state`);
      if (!res.ok) throw new Error('Falha ao obter estado do servidor');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dng67-state-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao exportar dados: ' + (err.message || err));
    }
  };

  const importState = () => fileInputRef.current?.click();

  const onFileSelected = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const obj = JSON.parse(text);
      if (typeof obj !== 'object' || obj === null) throw new Error('Formato inválido');
      const entries = Object.entries(obj);
      for (const [k, v] of entries) {
        // salva cada chave no servidor
        await writeServerState(k, v);
      }
      alert('Importação concluída e sincronizada com o servidor.');
    } catch (err) {
      alert('Erro ao importar: ' + (err.message || err));
    } finally {
      e.target.value = '';
    }
  };

  useEffect(() => {
    const onSync = () => setSync(v => v + 1);
    const unsubscribe = subscribeServerUpdates((key) => {
      if (key.startsWith("dng67_char_")) onSync();
    });
    return unsubscribe;
  }, []);

  const alive = CHARS.filter(c=>charStatuses[c.id]==="vivo").length;

  const MOTIVES = [
    {d:"1","title":"Segredo Revelado","desc":"Monokuma vai expor o segredo de alguém ao grupo inteiro"},
    {d:"2","title":"Memória Apagada","desc":"Quer recuperar uma memória? Mate alguém para 'comprar' de volta"},
    {d:"3","title":"Chantagem","desc":"Fotos/vídeos comprometedores enviados a familiares se ninguém agir"},
    {d:"4","title":"Dívida de Esperança","desc":"Se ninguém matar em 72h, um estudante aleatório morre"},
    {d:"5","title":"Recompensa","desc":"O assassino ganha um item lendário da MonoLoja"},
    {d:"6","title":"Ameaça Direta","desc":"Alguém recebe mensagem: 'mate X ou eu o mato'"},
    {d:"7","title":"Rivalidade","desc":"Monokuma revela que dois estudantes têm objetivos incompatíveis"},
    {d:"8","title":"Motivo do Mestre","desc":"Personalizado — o Mestre cria um motivo para este grupo especificamente"},
  ];

  const POWERS = [
    {name:"Revelação Bomba","desc":"Expõe um Segredo de qualquer personagem ao grupo inteiro. Use quando a tensão precisa de uma bomba narrativa."},
    {name:"Pista Sumida","desc":"Remove uma pista coletada por um jogador aleatório. Ideal para criar frustração estratégica."},
    {name:"Motivo Urgente","desc":"Adiciona urgência — se ninguém agir em 30 min de tempo real, uma penalidade entra em vigor."},
    {name:"Testemunha Surpresa","desc":"Um NPC 'lembra' de algo que muda o rumo do debate no Tribunal. Pode ser fabricado."},
  ];

  const TABS = [
    {id:"turma",label:"👥 TURMA"},
    {id:"segredos",label:"🔐 SEGREDOS"},
    {id:"crimes",label:"🔪 CRIMES"},
    {id:"monokuma",label:"🐻 MONOKUMA"},
    {id:"quick",label:"⚡ REFERÊNCIA"},
  ];

  return (
    <div className="fade" style={{minHeight:"100vh",background:T.bg}}>
      {/* HEADER */}
      <div style={{background:T.s1,borderBottom:`3px solid ${T.red}`,padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{background:T.red,color:T.white,padding:"2px 8px",fontSize:10,letterSpacing:2,fontFamily:"Courier Prime"}}>⚠ CLASSIFICADO</span>
            <div>
              <span className="title" style={{fontSize:20,color:T.red,letterSpacing:3}}>PAINEL DO MESTRE</span>
              <span className="type" style={{color:T.muted,fontSize:10,marginLeft:10}}>TURMA 67 — USO EXCLUSIVO</span>
            </div>
          </div>
          <Btn variant="ghost" onClick={onBack} style={{fontSize:11}}>← SAIR</Btn>
        </div>

        {/* GLOBAL METERS */}
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span className="type" style={{fontSize:10,color:T.yellow,letterSpacing:1}}>☀️ ESPERANÇA GLOBAL</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>setGlobal(p=>({...p,hope:Math.max(0,p.hope-1)}))} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,cursor:"pointer"}}>−</button>
                <span className="pixel" style={{color:T.yellow,fontSize:22}}>{global.hope}<span style={{color:T.dim,fontSize:12}}>/50</span></span>
                <button onClick={()=>setGlobal(p=>({...p,hope:Math.min(50,p.hope+1)}))} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,cursor:"pointer"}}>+</button>
              </div>
            </div>
            <div style={{background:T.s4,height:8,borderRadius:1}}>
              <div style={{height:"100%",width:`${(global.hope/50)*100}%`,background:T.yellow,transition:"width .4s"}}/>
            </div>
          </div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span className="type" style={{fontSize:10,color:T.red,letterSpacing:1}}>💀 DESESPERANÇA GLOBAL</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>setGlobal(p=>({...p,despair:Math.max(0,p.despair-1)}))} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,cursor:"pointer"}}>−</button>
                <span className="pixel" style={{color:T.red,fontSize:22}}>{global.despair}<span style={{color:T.dim,fontSize:12}}>/50</span></span>
                <button onClick={()=>setGlobal(p=>({...p,despair:Math.min(50,p.despair+1)}))} style={{background:T.s4,border:"none",color:T.white,width:20,height:20,cursor:"pointer"}}>+</button>
              </div>
            </div>
            <div style={{background:T.s4,height:8,borderRadius:1}}>
              <div style={{height:"100%",width:`${(global.despair/50)*100}%`,background:T.red,transition:"width .4s"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
            {[["🟢 Vivos",CHARS.filter(c=>charStatuses[c.id]==="vivo").length,T.greenL],
              ["🟡 Feridos",CHARS.filter(c=>charStatuses[c.id]==="ferido").length,T.yellow],
              ["💀 Mortos",CHARS.filter(c=>charStatuses[c.id]==="morto").length,T.muted],
              ["⚡ Executados",CHARS.filter(c=>charStatuses[c.id]==="executado").length,T.red],
            ].map(([l,n,color])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div className="pixel" style={{color,fontSize:24,lineHeight:1}}>{n}</div>
                <div className="type" style={{color:T.dim,fontSize:9}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:2}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{background:tab===t.id?T.red:T.s3,color:tab===t.id?T.white:T.muted,
                border:"none",padding:"7px 14px",fontSize:10,letterSpacing:.5,cursor:"pointer",transition:"all .15s"}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center"}}>
          <Btn variant="dark" onClick={exportState} style={{fontSize:11}}>⬇️ Exportar Dados</Btn>
          <Btn variant="ghost" onClick={importState} style={{fontSize:11}}>⬆️ Importar Dados</Btn>
          <input ref={fileInputRef} type="file" accept="application/json" style={{display:"none"}} onChange={onFileSelected} />
        </div>
      </div>

      <div style={{padding:"20px",maxWidth:1000,margin:"0 auto"}}>

        {/* ─── TAB: TURMA ─────────────────────────────────── */}
        {tab==="turma"&&(
          <div className="slide">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Nome & Talento</th><th>Tipo</th>
                  <th>PV Max</th><th>PS Max</th><th>Init</th>
                  <th>Status</th><th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {CHARS.map(c=>{
                  const d2 = derive(c.attrs);
                  const st = charStatuses[c.id]||"vivo";
                  const sc = STATUS_COLOR[st];
                  const rb = ROLE_BADGE.player;
                  return (
                    <tr key={c.id} style={{cursor:"pointer"}} onClick={()=>setSelectedChar(c)}>
                      <td><span className="pixel" style={{color:T.red,fontSize:18}}>{c.num}</span></td>
                      <td>
                        <div className="type" style={{color:T.white,fontWeight:700,fontSize:12}}>{c.name}</div>
                        <div className="type" style={{color:T.dim,fontSize:10}}>{c.talent}</div>
                      </td>
                      <td><Badge bg={rb.bg} color={rb.text}>{rb.label}</Badge></td>
                      <td className="pixel" style={{color:T.greenL,fontSize:18}}>{d2.pvMax}</td>
                      <td className="pixel" style={{color:T.blue,fontSize:18}}>{d2.psMax}</td>
                      <td className="pixel" style={{color:T.yellow,fontSize:18}}>{d2.init}</td>
                      <td>
                        <span style={{color:sc,fontSize:12,fontFamily:"Courier Prime"}}>● {st.charAt(0).toUpperCase()+st.slice(1)}</span>
                      </td>
                      <td onClick={e=>e.stopPropagation()}>
                        <select value={st} onChange={e=>setCharStatuses(p=>({...p,[c.id]:e.target.value}))}
                          style={{fontSize:10,padding:"3px 6px",width:"auto"}}>
                          <option value="vivo">🟢 Vivo</option>
                          <option value="ferido">🟡 Ferido</option>
                          <option value="morto">💀 Morto</option>
                          <option value="executado">⚡ Executado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{marginTop:10,fontSize:10,color:T.dim,fontFamily:"Courier Prime"}}>
              💡 Clique em qualquer linha para ver detalhes completos do personagem
            </div>
          </div>
        )}

        {/* ─── TAB: SEGREDOS ──────────────────────────────── */}
        {tab==="segredos"&&(
          <div className="slide">
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {CHARS.map(c=>{
                const rb = ROLE_BADGE.player;
                const isMM = c.isMastermind;
                const lockCode = LOCK_CODES[c.id] || String(c.id).padStart(2,"0");
                const currentLocked = SERVER_CACHE[PERSIST_KEYS.charLocked(c.id)] ?? false;
                const bondStateRaw = SERVER_CACHE[PERSIST_KEYS.charBonds(c.id)] ?? null;
                const bondState = Array.isArray(bondStateRaw) && bondStateRaw.length ? bondStateRaw : (Array.isArray(c.bonds) ? c.bonds : []);
                return (
                  <div key={c.id} style={{background:T.s2,border:`1px solid ${isMM?"#5a1070":T.bd}`,
                    borderLeft:`3px solid ${isMM?"#c060e0":T.bd2}`,padding:"14px 16px",
                    boxShadow:isMM?`0 0 15px #8030b020`:"none"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span className="pixel" style={{color:T.red,fontSize:22}}>{c.num}</span>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span className="type" style={{color:T.white,fontWeight:700,fontSize:13}}>{c.name}</span>
                            <Badge bg={rb.bg} color={rb.text}>{rb.label}</Badge>
                            {isMM&&<Badge bg="#2a0840" color="#e060f0">★ MASTERMIND</Badge>}
                          </div>
                          <span className="type" style={{color:T.muted,fontSize:10}}>
                            {c.talent}{isMM&&<span style={{color:"#c060e0"}}> | Real: {c.talentReal}</span>}
                          </span>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        {bondState.map(b=><Badge key={`${c.id}-${b.id||b.name}`} bg={T.s3} color={T.muted} style={{fontSize:8}}>❤{b.lvl} {b.name.split(" ")[0]}</Badge>)}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div style={{background:T.s3,padding:"10px 12px",borderLeft:`2px solid ${T.yellow}`}}>
                        <div className="type" style={{color:T.yellow,fontSize:9,letterSpacing:1.5,marginBottom:6}}>🔐 CÓDIGO DE MEMÓRIA</div>
                        <div className="type" style={{color:T.white,fontSize:11,lineHeight:1.7}}>{lockCode}</div>
                      </div>
                      <div style={{background:T.s3,padding:"10px 12px",borderLeft:`2px solid ${currentLocked?T.greenL:T.red}`}}>
                        <div className="type" style={{color:currentLocked?T.greenL:T.red,fontSize:9,letterSpacing:1.5,marginBottom:6}}>STATUS DE MEMÓRIA</div>
                        <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.7}}>{currentLocked?"DESBLOQUEADA":"BLOQUEADA"}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div style={{background:T.s3,padding:"10px 12px",borderLeft:`2px solid ${T.red}`}}>
                        <div className="type" style={{color:T.red,fontSize:9,letterSpacing:1.5,marginBottom:6}}>🔐 SEGREDO</div>
                        <div className="type" style={{color:T.white,fontSize:11,lineHeight:1.7}}>{c.secret}</div>
                      </div>
                      <div style={{background:T.s3,padding:"10px 12px",borderLeft:`2px solid ${T.yellow}`}}>
                        <div className="type" style={{color:T.yellow,fontSize:9,letterSpacing:1.5,marginBottom:6}}>📖 ARCO NARRATIVO</div>
                        <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.7}}>{c.arc}</div>
                      </div>
                    </div>
                    {c.masterNote&&(
                      <div style={{marginTop:8,background:"#200a0a",border:`1px solid ${T.red}`,padding:"8px 10px"}}>
                        <span className="type" style={{color:T.red,fontSize:10,lineHeight:1.6}}>{c.masterNote}</span>
                      </div>
                    )}
                    {isMM&&c.abilityReal&&(
                      <div style={{marginTop:8,background:"#200a0a",border:`1px solid ${T.red}`,padding:"10px 12px"}}>
                        <div className="type" style={{color:"#ff6680",fontSize:9,letterSpacing:1.5,marginBottom:4}}>★ HABILIDADE REAL</div>
                        <div className="title" style={{color:"#ff6680",fontSize:12,letterSpacing:2}}>{c.abilityReal.name}</div>
                        <div className="type" style={{color:T.muted,fontSize:11,marginTop:4,lineHeight:1.6}}>{c.abilityReal.desc}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB: CRIMES ────────────────────────────────── */}
        {tab==="crimes"&&(
          <div className="slide">
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {crimes.map((cr,i)=>(
                <Card key={i} style={{border:`1px solid ${cr.killer?T.red:T.bd}`}}>
                  <SectionTitle icon="🔪" color={cr.killer?T.red:T.muted}>
                    CASO {i+1} {cr.killer&&`— ${cr.killer} → ${cr.victim}`}
                  </SectionTitle>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {[["ASSASSINO","killer","Nome do assassino..."],["VÍTIMA","victim","Nome da vítima..."],
                      ["MÉTODO","method","Como o crime foi cometido..."],["LOCAL","locale","Onde ocorreu..."],
                      ["ÁLIBI FORJADO","alibi","O que o assassino dirá que estava fazendo..."],["AÇÕES DE COBERTURA","cover","Quais das 3 ações foram usadas..."]
                    ].map(([label,field,ph])=>(
                      <div key={field}>
                        <div className="type" style={{fontSize:9,color:T.muted,letterSpacing:1,marginBottom:3}}>{label}</div>
                        <input value={cr[field]} onChange={e=>setCrimes(p=>p.map((c2,j)=>j===i?{...c2,[field]:e.target.value}:c2))}
                          style={{width:"100%"}} placeholder={ph}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[["PISTAS FALSAS PLANTADAS","fakeclues","Ex: faca com as impressões de X..."],
                      ["PISTAS REAIS DEIXADAS","realclues","O que os jogadores podem encontrar..."],
                    ].map(([label,field,ph])=>(
                      <div key={field}>
                        <div className="type" style={{fontSize:9,color:T.muted,letterSpacing:1,marginBottom:3}}>{label}</div>
                        <textarea value={cr[field]} onChange={e=>setCrimes(p=>p.map((c2,j)=>j===i?{...c2,[field]:e.target.value}:c2))}
                          style={{width:"100%",minHeight:60,resize:"vertical"}} placeholder={ph}/>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:10}}>
                    <div className="type" style={{fontSize:9,color:T.muted,letterSpacing:1,marginBottom:3}}>RESULTADO DO TRIBUNAL & NOTAS</div>
                    <textarea value={cr.notes} onChange={e=>setCrimes(p=>p.map((c2,j)=>j===i?{...c2,notes:e.target.value}:c2))}
                      style={{width:"100%",minHeight:50,resize:"vertical"}} placeholder="Resultado, reações dos jogadores, consequências narrativas..."/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: MONOKUMA ──────────────────────────────── */}
        {tab==="monokuma"&&(
          <div className="slide">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div>
                <Card>
                  <SectionTitle icon="🐻" color={T.yellow}>Motivos de Monokuma (d8)</SectionTitle>
                  {MOTIVES.map(m=>(
                    <div key={m.d} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bd}`}}>
                      <div style={{background:T.s3,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span className="pixel" style={{color:T.yellow,fontSize:22}}>{m.d}</span>
                      </div>
                      <div>
                        <div className="type" style={{color:T.white,fontWeight:700,fontSize:12,marginBottom:2}}>{m.title}</div>
                        <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.5}}>{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <div>
                <Card>
                  <SectionTitle icon="⚡" color={T.red}>Poderes Especiais (1 por sessão)</SectionTitle>
                  {POWERS.map((pw2,i)=>(
                    <div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${T.bd}`,opacity:monokumaPower[i]?.5:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div className="type" style={{color:monokumaPower[i]?T.dim:T.white,fontWeight:700,fontSize:12,marginBottom:4}}>{pw2.name}</div>
                        <input type="checkbox" checked={monokumaPower[i]||false}
                          onChange={e=>setMonokumaPower(p=>{const np=[...p];np[i]=e.target.checked;return np;})}
                          style={{width:16,height:16,cursor:"pointer",accentColor:T.red}}/>
                      </div>
                      <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.5}}>{pw2.desc}</div>
                      {monokumaPower[i]&&<Badge bg="#300a00" color={T.dim} style={{marginTop:4}}>JÁ UTILIZADO</Badge>}
                    </div>
                  ))}
                </Card>
                <Card style={{marginTop:12}}>
                  <SectionTitle icon="🏪">MonoLoja — Itens</SectionTitle>
                  <table>
                    <thead><tr><th>Item</th><th>Custo</th><th>Efeito</th></tr></thead>
                    <tbody>
                      {[["Kit Primeiros Socorros","3","Cura 2d6 PV"],["Câmera Descartável","5","Cria 1 Pista Fotográfica"],
                        ["Veneno Indetectável","8","+2 em testes de veneno"],["Diário Criptografado","4","Revela 1 segredo de NPC"],
                        ["Megafone","3","+3 PER em debate público"],["Carta de Alibi","6","NPC confirma 1 álibi"]
                      ].map(([name,cost,ef])=>(
                        <tr key={name}><td className="type" style={{color:T.white,fontSize:11}}>{name}</td>
                        <td className="pixel" style={{color:T.yellow,fontSize:18}}>{cost}</td>
                        <td className="type" style={{color:T.muted,fontSize:11}}>{ef}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: REFERÊNCIA ────────────────────────────── */}
        {tab==="quick"&&(
          <div className="slide">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card>
                <SectionTitle icon="🎲">Testes Frequentes</SectionTitle>
                <table>
                  <thead><tr><th>Situação</th><th>Attr</th><th>NA</th></tr></thead>
                  <tbody>
                    {[["Procurar pista óbvia","INT","10"],["Encontrar pista escondida","INT","18"],["Mentir para alguém","PER","15–20"],
                      ["Detectar mentira","INT","15–20"],["Assassinato furtivo","FUR","18"],["Convencer no Tribunal","PER","18"],
                      ["Forjar álibi","PER","18"],["Interrogar NPC amigável","PER","12"],["Interrogar NPC hostil","PER","20"],
                      ["Recuperar sanidade","ESP","15"],["Reconstituição do Crime","INT","20"],
                    ].map(([s,a,na])=>(
                      <tr key={s}><td className="type" style={{fontSize:11}}>{s}</td>
                      <td><Badge bg={T.redD} color={T.white}>{a}</Badge></td>
                      <td className="pixel" style={{color:T.yellow,fontSize:18}}>{na}</td></tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <Card>
                <SectionTitle icon="📊">Eventos de Esperança</SectionTitle>
                <table>
                  <thead><tr><th>Evento</th><th>Impacto</th></tr></thead>
                  <tbody>
                    {[["Tribunal correto","+3 ☀️"],["Acusação errada","−5 ☀️ / +3 💀"],["Assassino fugiu impune","−2 ☀️"],
                      ["Segredo revelado","−1 ☀️"],["Laço reforçado","+1 ☀️"],["Dedução brilhante","+1 ☀️"],
                      ["Desesperança atinge 50","DERROTA COLETIVA"],["Esperança atinge 50","VITÓRIA COLETIVA"]
                    ].map(([e,i])=>(
                      <tr key={e}>
                        <td className="type" style={{fontSize:11}}>{e}</td>
                        <td className="type" style={{color:i.includes("+")?T.greenL:i.includes("VITÓRIA")?T.yellow:T.red,fontWeight:700,fontSize:12}}>{i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{marginTop:14}}>
                  <SectionTitle icon="⚠️">Condições de Derrota</SectionTitle>
                  <div className="type" style={{color:T.muted,fontSize:11,lineHeight:1.8}}>
                    • Restar apenas 1 estudante vivo<br/>
                    • Desesperança global atingir 50<br/>
                    • Assassino escapar impune 3× seguidas
                  </div>
                </div>
              </Card>
              <Card style={{gridColumn:"1/-1"}}>
                <SectionTitle icon="🗺️">Iniciativas da Turma (ordem decrescente)</SectionTitle>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[...CHARS].sort((a,b)=>{const da=derive(a.attrs),db=derive(b.attrs);return db.init-da.init;}).map(c=>{
                    const d2=derive(c.attrs);
                    const st=charStatuses[c.id]||"vivo";
                    return (
                      <div key={c.id} style={{background:T.s3,padding:"6px 10px",opacity:st==="morto"||st==="executado"?.4:1,
                        border:`1px solid ${T.bd}`,display:"flex",gap:8,alignItems:"center"}}>
                        <span className="pixel" style={{color:T.yellow,fontSize:20}}>{d2.init}</span>
                        <div>
                          <div className="type" style={{fontSize:11,color:T.white}}>{c.name.split(" ")[0]}</div>
                          <div className="type" style={{fontSize:9,color:T.dim}}>{c.num}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* CHARACTER DETAIL MODAL */}
      {selectedChar&&(
        <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={()=>setSelectedChar(null)}>
          <div className="slide" onClick={e=>e.stopPropagation()}
            style={{background:T.s2,border:`2px solid ${T.red}`,maxWidth:700,width:"100%",maxHeight:"85vh",overflowY:"auto",padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <span className="pixel" style={{color:T.red,fontSize:26,marginRight:8}}>{selectedChar.num}</span>
                <span className="title" style={{fontSize:22,color:T.white}}>{selectedChar.name}</span>
                {selectedChar.isMastermind&&(
                  <Badge bg="#3a0814" color="#e060f0" style={{marginLeft:8}}>★ MASTERMIND</Badge>
                )}
                <div className="type" style={{color:T.muted,fontSize:11}}>
                  {selectedChar.talent}
                  {selectedChar.isMastermind&&(
                    <span style={{color:"#e060f0",marginLeft:8}}>| Real: {selectedChar.talentReal}</span>
                  )}
                </div>
              </div>
              <button onClick={()=>setSelectedChar(null)} style={{background:"none",border:"none",color:T.white,fontSize:22,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div style={{background:T.s3,padding:"10px"}}>
                <div className="type" style={{color:T.muted,fontSize:9,marginBottom:4,letterSpacing:1}}>ATRIBUTOS</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.entries(selectedChar.attrs).map(([k,v])=>(
                    <div key={k} style={{textAlign:"center",background:T.s4,padding:"4px 8px"}}>
                      <div className="type" style={{fontSize:8,color:T.dim}}>{k}</div>
                      <div className="pixel" style={{color:T.yellow,fontSize:20}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:T.s3,padding:"10px"}}>
                <div className="type" style={{color:T.muted,fontSize:9,marginBottom:6,letterSpacing:1}}>APARÊNCIA & PERSONALIDADE</div>
                <div className="type" style={{fontSize:11,color:T.white,lineHeight:1.6}}>{selectedChar.appear}</div>
              </div>
            </div>
            <div style={{background:"#200a0a",border:`1px solid ${T.red}`,padding:"12px",marginBottom:10}}>
              <div className="type" style={{color:T.red,fontSize:9,letterSpacing:1.5,marginBottom:6}}>🔐 SEGREDO COMPLETO</div>
              <div className="type" style={{color:T.white,fontSize:12,lineHeight:1.7}}>{selectedChar.secret}</div>
            </div>
            <div style={{background:T.s3,padding:"12px",marginBottom:selectedChar.masterNote?10:0}}>
              <div className="type" style={{color:T.yellow,fontSize:9,letterSpacing:1.5,marginBottom:6}}>📖 ARCO NARRATIVO</div>
              <div className="type" style={{color:T.muted,fontSize:12,lineHeight:1.7}}>{selectedChar.arc}</div>
            </div>
            {selectedChar.masterNote&&(
              <div style={{background:"#0a1a00",border:`1px solid ${T.green}`,padding:"10px"}}>
                <div className="type" style={{color:T.greenL,fontSize:11,lineHeight:1.6}}>{selectedChar.masterNote}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState("login");
  const [currentChar, setCurrentChar] = useState(null);
  const [charTransition, setCharTransition] = useState(null); // char being loaded
  const [masterTransition, setMasterTransition] = useState(false);

  useEffect(()=>{ injectStyles(); },[]);

  const handleLogin = (type, data) => {
    if(type==="master") {
      setMasterTransition(true);
    } else if(type==="rules") {
      setScreen("rules");
    } else if(type==="character") {
      setCharTransition(data);
    }
  };

  const goBack = () => { setScreen("login"); setCurrentChar(null); };

  return (
    <>
      {/* Global CRT boot on first load */}
      {!booted && <BootScreen onComplete={()=>setBooted(true)}/>}

      {/* Character file loading transition */}
      {charTransition && (
        <CharTransitionScreen
          char={charTransition}
          onComplete={()=>{
            setCurrentChar(charTransition);
            setCharTransition(null);
            setScreen("character");
          }}
        />
      )}

      {/* Master panel transition */}
      {masterTransition && (
        <MasterTransitionScreen onComplete={()=>{
          setMasterTransition(false);
          setScreen("master");
        }}/>
      )}

      <div className="scanline-overlay"/>
      {screen==="login"  && !charTransition && !masterTransition && <LoginScreen onLogin={handleLogin}/>}
      {screen==="rules"  && <RulesScreen onBack={goBack}/>}
      {screen==="character" && currentChar && !charTransition && <CharacterScreen char={currentChar} onBack={goBack}/>}
      {screen==="master" && !masterTransition && <MasterScreen onBack={goBack}/>}
    </>
  );
}
