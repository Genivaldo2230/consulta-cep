const formulario = document.getElementById('formulario-cep');
const campoCep = document.querySelector('#cep');
const mensagem = document.querySelector('#mensagem');
const resultado = document.querySelector('#resultado');
const button = document.querySelector('#button');


campoCep.addEventListener("input", () => {
    let cep = campoCep.value.replace(/\D/g, "");

    cep = cep.slice(0, 8);

    if (cep.length > 5) {
        cep = cep.slice(0, 5) + "-" + cep.slice(5);
    }
    campoCep.value = cep;
});

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    //Remove pontos, espaço e hifens
    const cep = campoCep.value.replace(/\D/g, "");

    //Valida o formato do CEP
    if (cep.length !== 8) {
        mensagem.textContent = "Digite um CEP valido com 8 Numeros.";
        resultado.hidden = true;
        return;
    }
    mensagem.textContent = "Buscando endereço...";
    resultado.hidden = true;
    button.disabled = true;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar o CEP.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            mensagem.textContent = "CEP não encontrado.";
            return;
        }

        //Monta o endereço sem inserir HTML externo

        resultado.replaceChildren();

        const campos = [
            ["CEP", dados.cep],
            ["Logradouro", dados.logradouro],
            ["Bairro", dados.bairro],
            ["Cidade", dados.localidade],
            ["Estado", dados.uf]
        ];

        campos.forEach(([label, valor]) => {
            const paragrafo = document.createElement("p");
            const titulo = document.createElement("strong");

            titulo.textContent = `${label}: `;
            paragrafo.append(titulo);
            paragrafo.append(document.createTextNode(valor || "Não informado")
            );
            resultado.append(paragrafo);
        });

        resultado.hidden = false;
        mensagem.textContent = "Endereço encontrado com sucesso!";
    } catch (erro) {
        mensagem.textContent = "Erro ao consultar.Vrefique o CEP e tente novamente.";

        console.error(erro);
    } finally {
        button.disabled = false;
    }
});