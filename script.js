// Seleciona o elemento HTML onde os cards serão inseridos, usando sua classe CSS.
let cardContainer = document.querySelector(".card-container");
// Seleciona o campo de input que está dentro do <header>.
let campoBusca = document.querySelector("header input");
// Declara um array vazio que será usado para armazenar os dados das linguagens vindos do data.json.
let dados = [];

// Função assíncrona que busca e filtra os dados. É chamada a partir de um evento no HTML (ex: onkeyup ou onclick).
async function iniciarBusca() {
    // Verifica se o array 'dados' está vazio. Se estiver, significa que é a primeira vez que a função é executada.
    if (dados.length === 0) {
        // O bloco 'try' tenta executar um código que pode falhar (ex: uma requisição de rede).
        try {
            // Faz a requisição para o arquivo 'data.json'. 'await' pausa a execução até a resposta chegar.
            let resposta = await fetch("data.json");
            // Converte a resposta em formato JSON e armazena no array 'dados'. 'await' pausa até a conversão terminar.
            dados = await resposta.json();
        // O bloco 'catch' é executado se ocorrer um erro dentro do bloco 'try'.
        } catch (error) {
            // Exibe uma mensagem de erro detalhada no console do navegador se a busca ou conversão falhar.
            console.error("Falha ao buscar os dados:", error);
            return; // Sai da função se houver um erro na busca
        }
    }

    // Pega o valor atual do campo de busca e o converte para letras minúsculas.
    const termoBusca = campoBusca.value.toLowerCase();
    // Usa o método .filter() para criar um novo array 'dadosFiltrados'.
    // O filtro inclui um 'dado' se o 'termoBusca' estiver contido no nome OU na descrição da linguagem.
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        (dado.tags && dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))) // Adiciona busca por tags com segurança
    );
    // Chama a função para renderizar na tela apenas os cards que passaram no filtro.
    renderizarCards(dadosFiltrados);
}   

// Função responsável por criar e exibir os cards na página. Ela recebe um array de dados para renderizar.
function renderizarCards(dados) {
    // Limpa completamente o conteúdo do container para remover os cards antigos antes de adicionar os novos.
    cardContainer.innerHTML = ""; 
    // Itera sobre cada objeto 'dado' dentro do array de dados fornecido.
    for (let dado of dados) {
        // Cria um novo elemento HTML <article> na memória.
        let article = document.createElement("article");
        // Adiciona a classe CSS "card" ao novo article, para que ele receba os estilos definidos.
        article.classList.add("card");

        // Cria o HTML para as tags
        const tagsHTML = dado.tags ? dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        // Define o conteúdo HTML interno do article usando uma template string para facilitar a inserção das variáveis.
        article.innerHTML = `
        <img src="${dado.logo}" alt="Logo ${dado.nome}" class="logo-linguagem">
        <h2>${dado.nome}</h2>
        <p>${dado.nascimento}</p>
        <p>${dado.historia}</p>
        <p>${dado.descricao}</p>
        <p class="exemplo-titulo">${dado.exemplo[0].titulo}</p>
        <pre><code>${dado.exemplo[0].codigo}</code></pre> 
        <div class="tags-container"><strong>Tags:</strong> ${tagsHTML}</div>
        <a href="${dado.documentacao}" target="_blank">Saiba mais</a>
        `
        // Adiciona o elemento <article> recém-criado como um filho do 'cardContainer', tornando-o visível na página.
        cardContainer.appendChild(article);
    }
}

// Chama a função iniciarBusca() assim que o script é carregado.
// Como o campo de busca está vazio, ele irá buscar os dados e renderizar todos os cards.
iniciarBusca();

// Antiga função para carregar os dados do JSON ao iniciar a página (não mais usada).
// async function carregarDados() {
//     let resposta = await fetch("data.json");
//     dados = await resposta.json();
//     // console.log(dados);
//     renderizarCards(dados);
// }