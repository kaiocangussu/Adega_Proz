// Array
const produtosArray = ["Arroz 5kg", 25.90, "Mercearia"]

// Objeto ou Lista para quem veio do pyton
// chave / index : valor / resultado

const produto = {
    nome: "Arroz 5kg",
    preco: 25.90,
    categoria: "Mercearia"
}

console.log(produto.nome)
console.log(produto.preco)
console.log(produto.categoria)

// array de objeto

const produtos = [
    {
        nome: "Arroz 5kg",
        preco: 25.90,
        categoria: "Mercearia"
    },
    { 
        nome: "Nuget",
        preco: 24,
        categoria: "Frios"
    },
    { 
        nome: "Leite 1L",
        preco: 8,
        categoria: "Laticinio"
    }
]

console.log("==============")

// Lista todos os produtos
console.log(produtos)
// Lista o produto 1 (o segundo da lista)
console.log(produtos[1])
// Pega o nome do terceiro produto
console.log(produtos[2].nome)

// Lista todos os nomes
const nomes = produtos.map(produto => produto.nome)
console.log(nomes)

produtos.push({
    nome: "Miojo Turma da monica de tomate",
    preco: 2.99,
    categoria: "Mercearia"
})

console.log(produtos)

// SetItem serve para Adicionar itens no localStorage
const nome = "MErcearia Proz"
localStorage.setItem("Minha Loja", nome)

// getItem serve para pegar um item do localStorage
const minhaLoja = localStorage.getItem("Aluno")
console.log("Minha Loja é " + minhaLoja)

// 1 - Adicionar 3 produtos no final do arry usando .push()
produtos.push(
    {
        nome: "Tang Guarana",
        preco: 0.50,
        categoria: "Mercearia"
    },
    {
        nome: "Iorgute Grego de Morango",
        preco: 5,
        categoria: "Laticinio"
    },
    {
        nome: "BomBom beijinho da marca bon bon",
        preco: 64,
        categoria: "Mercearia"
    }
)
console.log(produtos)

// 2 - Usar o .map() e .filter() para achar o produto mais barato
const valoresProduto = produtos.map((produto) => produto.preco)
const menorValor = Math.min(...valoresProduto)
const produtoMenorValor = produtos.filter((produto) => produto.preco == menorValor)
console.log(produtoMenorValor)

// 3 - Usar o .find() para achar algum produto pelo nome
const produtoEncontrado = produtos.find((produto) => 
                produto.nome == "Miojo Turma da monica de tomate"
)

console.log(produtoEncontrado)
// 4 - Usar o .reduce() para fazer a soma dos preços
const somaPrecoProdutos = produtos.reduce((total, produto) => 
    total + produto.preco
, 0)
console.log(somaPrecoProdutos)

// 5 - Salvar um dado no localStorage e ler o mesmo
const produtosString = JSON.stringify(produtos)
localStorage.setItem("Produtos", produtosString)

console.log(produtos)
const produtosLocalStorage = JSON.parse(localStorage.getItem("Produtos"))
console.log(produtosLocalStorage)


// Crud
// Create
// 0 - Colocar tudo isso em um escutador de evento / função

// 1 - Pegar os valores digitados na tela e colocar em variaveis
const nomeProdutoDigitado = document.getElementById("nome").value
const precoProdutoDigitado = Number(document.getElementById("preco").value)
const categoriaProdutoDigitado = document.getElementById("categoria").value

// 2 --Criar um objeto com esses valores

// 3 - Pegar os valores que estão no local storage (transformando eles em json)

// 4 - usar o .push para colocar os valores nesse json

// 5 - Salvar o novo json no local storage



// Read
const listaProdutos = document.getElementById("lista-produtos")
// Usar o .map() para escrever no html os produtos
// '' apóstrofo ou aspas simples
// "" aspas duplas
// `` crase ${variavel}
listaProdutos.innerHTML = 
produtosLocalStorage.map((produto) => `
    <article>
        <h3>Nome: ${produto.nome}</h3>
        <p>Preço: R$ ${produto.preco}</p>
        <p>Categoria: ${produto.categoria}</p>
    </article>
    <hr>
`).join("")
