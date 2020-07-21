export function loadLists() {
    return [
      { 
        title: 'Backlog', 
        creatable: true,
        cards: [
          {
            id: 1,
            content: 'Estudar módulo 01 de NodeJS',
            labels: ['red'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 2,
            content: 'Criar vídeo para o Youtube ensinando a recriar a interface do Pipefy',
            labels: ['green'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 3,
            content: 'Estudar módulo 03 de React Native',
            labels: ['green'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 4,
            content: 'Gravar Aula "NextJS: Utilizando server-side rendering com ReactJS"',
            labels: ['blue'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 5,
            content: 'Gravar testes e deploy ReactJS',
            labels: ['blue'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
        ]
      },
      { 
        title: 'A Fazer', 
        creatable: false,
        cards: [
          {
            id: 6,
            content: 'Recriando clone do Pipefy',
            labels: ['green'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          }
        ]
      },
      { 
        title: 'Em Andamento', 
        creatable: false,
        cards: [
          {
            id: 7,
            content: 'Gravar sobre Geolocalização e mapas com React Native',
            labels: ['green'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 8,
            content: 'Gravar testes e deploy ReactJS',
            labels: ['blue'],
            user: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/profile.png'
          },
          {
            id: 9,
            content: 'Ajustes na biblioteca unform',
            labels: ['red'],
          }
        ]
      },
      { 
        title: 'Revisão/Aprovação', 
        creatable: false,
        done: true,
        cards: [
          {
            id: 10,
            content: 'Gravar aula sobre deploy e CI com React Native',
            labels: ['red'],
          },
          {
            id: 12,
            content: 'Gravar testes e deploy ReactJS',
            labels: ['blue'],
          },
          {
            id: 13,
            content: 'Gravar Aula "Internacionalização de aplicações Node.js, ReactJS e React Native"',
            labels: ['green'],
          }
        ]
      },
      { 
        title: 'Entrega', 
        creatable: false,
        done: true,
        cards: [
          {
            id: 10,
            content: 'Gravar aula sobre deploy e CI com React Native',
            labels: ['red'],
          },
          {
            id: 12,
            content: 'Gravar testes e deploy ReactJS',
            labels: ['blue'],
          },
          {
            id: 13,
            content: 'Gravar Aula "Internacionalização de aplicações Node.js, ReactJS e React Native"',
            labels: ['green'],
          }
        ]
      },
    ];
  }