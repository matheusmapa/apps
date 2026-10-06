// Tudo o que muda no site fica aqui. Depois de editar: node _build/build.mjs

// Endereço público do site, sem barra no fim.
// Quando o domínio próprio estiver no ar, troque aqui (ex.: "https://mapas.com.br") e rode o build.
export const SITE_URL = "https://matheusmapa.github.io/apps";

export const COMPANY = {
  name: "Mapa’s",
  playName: "Mapa's", // exatamente como aparece na Google Play
  owner: "Matheus Enrique Assis Mapa",
  ownerShort: "Matheus Mapa",
  city: "Conselheiro Lafaiete",
  uf: "MG",
  email: "menrique757@gmail.com",
  legalName: "", // razão social: preencher quando tiver
  cnpj: "", // formato 00.000.000/0000-00: preencher quando tiver
  sitePolicyUpdated: "5 de outubro de 2026",
};

export const PRINCIPLES = [
  { title: "Sem cadastro.", text: "Abre e usa. Não tem conta, senha nem e-mail de confirmação." },
  { title: "Sem anúncios.", text: "Nenhum banner, nenhum vídeo pra assistir antes de continuar." },
  {
    title: "Seus dados ficam com você.",
    text: "Tudo é salvo no seu celular. A gente não tem servidor guardando nada seu.",
  },
  {
    title: "Paga uma vez, se quiser.",
    text: "Todo app é grátis pra começar. O Pro é um pagamento único, sem assinatura. No Studz também tem plano mensal e anual.",
  },
];

// status: "live" (mostra o selo da Google Play), "testing" ou "soon" (mostram "Em breve", sem link pra loja).
// Quando um app for publicado: troque o status pra "live" e rode o build.
export const APPS = [
  {
    slug: "studz",
    name: "Studz",
    fullName: "Studz: Pomodoro e Flashcards",
    category: "Educação",
    schemaCategory: "EducationalApplication",
    accent: "#B9DB2C",
    status: "testing",
    soonText: "Está em teste fechado e chega à loja na segunda quinzena de outubro de 2026.",
    playUrl: "https://play.google.com/store/apps/details?id=com.Studz.app",
    pitch: "Foco, flashcards e revisão espaçada. Sem cadastro, tudo no seu celular.",
    priceShort: "Grátis + Pro",
    price:
      "Pomodoro, cronômetro, flashcards e tarefas são grátis pra sempre. O Studz Pro libera as outras ferramentas e pode ser mensal, anual (com 7 dias grátis) ou vitalício, com um pagamento só.",
    privacy:
      "Matérias, baralhos, anotações e sessões de estudo ficam salvos só no seu celular. Pra saber se você tem o Pro, o app usa um identificador anônimo, sem nome nem e-mail.",
    highlights: [
      ["Pomodoro e cronômetro", "Ciclos com pausa curta e longa, ou um cronômetro livre que separa o tempo de estudo das pausas."],
      ["Modo Floresta", "Cada sessão de foco faz nascer uma planta. Saiu do app, ela seca. As plantas viram broches colecionáveis."],
      ["Flashcards com revisão espaçada", "Algoritmo SM-2: cada cartão volta pouco antes de você esquecer. Também tem caixas de Leitner e quiz."],
      ["Feynman e notas Cornell", "Técnica Feynman guiada em 3 etapas e notas Cornell com perguntas-chave e resumo."],
      ["Tarefas e meta diária", "Tarefas com prazo e matéria, sequência de dias e lembrete no horário que você escolher."],
      ["Estatísticas", "Gráfico, mapa de calor e tempo por matéria pra ver onde seu estudo está indo."],
    ],
    shots: [
      "Tela inicial do Studz com o resumo do dia",
      "Sessão de foco do Modo Floresta com uma planta crescendo",
      "Coleção de broches de plantas do jardim",
      "Revisão de flashcards",
      "Timer Pomodoro em andamento",
      "Estatísticas de estudo com gráfico",
      "Lista de métodos de estudo do app",
    ],
    updated: { privacy: "1 de outubro de 2026", terms: "1 de outubro de 2026" },
  },
  {
    slug: "geladeira",
    name: "Na Geladeira",
    fullName: "Na Geladeira: Pare de Gastar",
    category: "Finanças",
    schemaCategory: "FinanceApplication",
    accent: "#0A6F98",
    status: "soon",
    playUrl: "https://play.google.com/store/apps/details?id=app.nageladeira",
    pitch: "Quer comprar? Bota na geladeira. Veja o preço em horas de trabalho e economize.",
    priceShort: "Grátis + Pro",
    price:
      "Grátis com até 5 itens na geladeira. O Na Geladeira Pro libera itens ilimitados, histórico completo e esperas de 60 e 90 dias, com um pagamento único. Sem assinatura.",
    privacy:
      "Os itens, os preços e a sua renda ficam só no seu celular. A conta de horas de trabalho é feita no próprio aparelho.",
    highlights: [
      ["Anote a vontade", "Deu vontade de comprar? Anote o item e o preço. Leva uns segundos."],
      ["Preço em horas de trabalho", "Veja na hora quanto aquilo custa do seu tempo. “R$ 449 = 2,5 dias trabalhando” muda a conversa."],
      ["Deixe esfriar", "O item fica na geladeira por 24 horas, 3, 7 ou 30 dias. No fim, um aviso pergunta se você ainda quer."],
      ["O que você desiste vira economia", "Veja o total que deixou de gastar e quantas horas de trabalho poupou."],
      ["Sem julgamento", "Comprar com calma também conta. Se ainda quiser depois da espera, compra sem culpa."],
    ],
    shots: [
      "Geladeira com itens esperando a vontade passar",
      "Tela de adicionar um item com o preço",
      "Detalhe do item com o preço em horas de trabalho",
      "Item que você desistiu de comprar, somado à economia",
      "Resumo da economia e horas de trabalho poupadas",
    ],
    updated: { privacy: "5 de outubro de 2026", terms: "5 de outubro de 2026" },
  },
  {
    slug: "constante",
    name: "Constante",
    fullName: "Constante: Hábitos Diários",
    category: "Saúde e fitness",
    schemaCategory: "HealthApplication",
    accent: "#C2410C",
    status: "soon",
    playUrl: "https://play.google.com/store/apps/details?id=app.constante.habitos",
    pitch: "Crie hábitos, marque o dia e não quebre a sequência.",
    priceShort: "Grátis + Pro",
    price:
      "Grátis com até 3 hábitos, pra sempre. O Constante Pro libera hábitos ilimitados, histórico completo e backup, com um pagamento único. Sem assinatura.",
    privacy: "Seus hábitos, o histórico e os lembretes ficam só no seu celular. O app não coleta nada.",
    highlights: [
      ["Um toque por dia", "Abra, toque no hábito, pronto. Escolha em quais dias da semana cada um vale."],
      ["Hábitos de quantidade", "Copos de água, páginas lidas, minutos de exercício: marque quanto fez, não só se fez."],
      ["Sequência e recorde", "Veja a sequência atual de cada hábito e o seu recorde."],
      ["O ano inteiro num mapa", "Um mapa de calor mostra a sua constância dia a dia, o ano todo."],
      ["Lembrete por hábito", "Cada hábito tem o seu horário e só lembra nos dias certos."],
    ],
    shots: [],
    featureAlt: "Constante: hábitos, um dia de cada vez",
    updated: { privacy: "5 de outubro de 2026", terms: "5 de outubro de 2026" },
  },
  {
    slug: "lacre",
    name: "Lacre",
    fullName: "Lacre: Cartas para o Futuro",
    category: "Estilo de vida",
    schemaCategory: "LifestyleApplication",
    accent: "#9E2A24",
    status: "soon",
    playUrl: "https://play.google.com/store/apps/details?id=app.lacre.cartas",
    pitch: "Escreva uma carta, escolha a data e lacre. Nem você lê antes.",
    priceShort: "Grátis + Pro",
    price:
      "Grátis com até 3 cartas lacradas, pra sempre. O Lacre Pro libera cartas ilimitadas, esperas de até 10 anos, uma foto por carta, todas as cores de lacre e backup, com um pagamento único. Sem assinatura.",
    privacy: "As cartas ficam só no seu celular, lacradas. Ninguém lê, nem a gente, nem você antes da data.",
    highlights: [
      ["Uma cápsula do tempo no bolso", "Escreva pro seu eu do futuro, escolha quando a carta abre e lacre com cera."],
      ["Perguntas guiadas", "O que te preocupa, do que você tem orgulho, uma previsão, um conselho. Pra quando faltar o que escrever."],
      ["Lacrada de verdade", "Até o dia chegar, a carta não abre. Se precisar muito, dá pra quebrar o lacre, mas fica marcado."],
      ["Aviso na manhã do dia", "Uma notificação avisa que a carta está pronta, sem mostrar nada do conteúdo."],
      ["Responda com outra carta", "Depois de abrir, escreva de volta e mantenha a conversa com você mesmo."],
    ],
    shots: [],
    featureAlt: "Lacre: um envelope fechado com lacre de cera vermelho",
    updated: { privacy: "5 de outubro de 2026", terms: "5 de outubro de 2026" },
  },
  {
    slug: "folga",
    name: "Folga",
    fullName: "Folga: Escala de Trabalho",
    category: "Produtividade",
    schemaCategory: "ProductivityApplication",
    accent: "#13885A",
    status: "soon",
    playUrl: "https://play.google.com/store/apps/details?id=app.folga.escala",
    pitch: "Hoje você folga? Sua escala 12x36, 6x1, 4x2 no calendário e folgas em comum.",
    priceShort: "Grátis + Pro",
    price:
      "A sua escala é grátis pra sempre. O Folga Pro libera outras pessoas no calendário, a visão do ano, compartilhar sem marca e backup, com um pagamento único. Sem assinatura.",
    privacy: "Sua escala e as escalas de outras pessoas ficam só no seu celular. Pra mandar uma escala, você usa o app que quiser, como o WhatsApp.",
    highlights: [
      ["Escalas prontas", "12x36, 6x1, 5x2, 4x2, 2x2, 24x48 e outras, de dia ou de noite. Ou monte a sua."],
      ["Hoje eu folgo?", "A resposta logo na abertura, com a próxima folga e o próximo fim de semana livre."],
      ["Feriados nacionais", "Calculados todo ano e marcados no calendário."],
      ["Aviso na véspera", "Um lembrete na noite antes de cada dia de trabalho, no horário que você escolher."],
      ["Folgas em comum", "Coloque a escala do parceiro, de um colega ou da família e veja os dias em que todo mundo folga."],
      ["Escala pelo WhatsApp", "A pessoa toca em Enviar, você cola a mensagem e a escala dela entra no seu calendário."],
    ],
    shots: [
      "Tela inicial do Folga respondendo se hoje é folga",
      "Calendário do mês com dias de trabalho e de folga",
      "Detalhe de um dia da escala",
      "Editor de escala com os modelos prontos",
      "Visão do ano inteiro da escala",
      "Folgas em comum com outras pessoas",
    ],
    updated: { privacy: "5 de outubro de 2026", terms: "5 de outubro de 2026" },
  },
];
