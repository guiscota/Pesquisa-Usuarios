let todosUsuarios = [];
let inputUsuario = '';
let somatorioIdades = 0;
let calculoMediaIdades = 0;

window.addEventListener('load', () => {
  form = document.querySelector('form');
  loader = document.querySelector('.preloader-wrapper');

  usuariosFiltrados = document.querySelector('.usuarios-filtrados');
  inputUsuario = document.querySelector("#inputUsuario");

  totalUsuarios = document.querySelector('#totalUsuarios');
  totalSexoMasculino = document.querySelector("#totalSexoMasculino");
  totalSexoFeminino = document.querySelector("#totalSexoFeminino");
  totalIdades = document.querySelector("#totalIdades");
  mediaIdades = document.querySelector("#mediaIdades");

  numeroFormatado = Intl.NumberFormat("pt-BR");

  ocultarLoader();
  buscarUsuarios();
  previnirSubmit();
});

const previnirSubmit = () => {
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Evita que o formulário seja recarregado
  }

  form.addEventListener('submit', handleFormSubmit);
}

const ocultarLoader = () => {
  inputUsuario.disabled = true;

  setTimeout(() => {
    loader.classList.add('hide');
    inputUsuario.disabled = false;
    inputUsuario.focus();
  }, 1200);
};


/** Buscar dados dos usuários pela API fornecida */
const buscarUsuarios = async () => {

  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  let dados = await res.json();


  // Buscar somente os dados necessarios
  todosUsuarios = dados.results.map(usuario => {
    const { name, picture, dob, gender } = usuario;

    return {
      foto: picture.medium,
      genero: gender,
      nome: name.first + ' ' + name.last,
      idade: dob.age
    };
  });
  renderizarUsuarios();
}

const renderizarUsuarios = () => {
  inputPesquisa();

  // Filtrar usuários de acordo com a entrada
  const usuarioFiltrado = todosUsuarios.filter(usuario => {
    const nomeFormatado = usuario.nome.toLowerCase();
    const inputFormatado = inputUsuario.value.toLowerCase();

    return nomeFormatado.includes(inputFormatado);
  })

  // Ordenar em ordem alfabética os usuarios de acordo com os nomes
  usuarioFiltrado.sort((a, b) => {
    return a.nome.localeCompare(b.nome);
  });
 
  let usuariosHTML = '';
  
  totalUsuarios.textContent = usuarioFiltrado.length;

  usuarioFiltrado.forEach(usuario => {
    const { nome, foto, idade } = usuario;

    // Cria as linha HTMl com os dados dos usuários
    const usuarioHTML = `
    <li class="collection-item">
      <img src="${usuario.foto}" class="circle">
      <p class="flow-text">${usuario.nome}, <spam>${usuario.idade}</spam> anos</p>
    </li>`;

    usuariosHTML += usuarioHTML;

  });
  usuariosFiltrados.innerHTML = usuariosHTML;
  renderizarEstatisticas(usuarioFiltrado);
}

/** listener do input */
const inputPesquisa = () => {
  inputUsuario.addEventListener("keyup", verificarValorDigitado);
  inputUsuario.focus();
  return inputUsuario;
}

/** Parâmetro de evento e chamada para renderização */
const verificarValorDigitado = (event) => {
  renderizarUsuarios();
  
  let temTexto = !!inputUsuario.value; // Verificação, se o input estiver vazio torna a variavel false, senao true

  if (!temTexto) {
    if (event.key === 'Enter') {
      M.toast({ html: 'Preencha um ao menos uma letra.' });
    }
    return;
  }
}

const renderizarEstatisticas = (usuarioFiltrado) => {
  const arrayHomens = usuarioFiltrado.filter(usuario => usuario.genero === "male");
  const arrayMulheres = usuarioFiltrado.filter(usuario => usuario.genero === "female");

  totalSexoMasculino.textContent = arrayHomens.length;
  totalSexoFeminino.textContent = arrayMulheres.length;

  const somatorioIdades = usuarioFiltrado.reduce((acc, current) => {
    return acc + current.idade;
  }, 0);

  totalIdades.textContent = usuarioFiltrado.length !== 0 ? formatNumber(somatorioIdades) : 0;

  const calculoMediaIdades =
    usuarioFiltrado.length !== 0 ? formatNumber(somatorioIdades / usuarioFiltrado.length) : 0;

  mediaIdades.textContent = calculoMediaIdades;
}

/** Formata numeros */
const formatNumber = (number) => {
  return numeroFormatado.format(number);
}