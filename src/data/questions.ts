export interface Question {
  id: string
  topic: string
  text: string
  options: Array<{ id: string; text: string }>
  correctOption: string
  explanation: string
}

export const mockQuestions: Question[] = [
  // JavaScript
  {
    id: 'js_1',
    topic: 'JavaScript Básico',
    text: '¿Cuál es la diferencia entre var, let y const?',
    options: [
      { id: 'a', text: 'No hay diferencia' },
      { id: 'b', text: 'var es de ámbito global, let es de bloque, const es de bloque pero inmutable' },
      { id: 'c', text: 'let es más rápido que const' },
      { id: 'd', text: 'const no se puede usar en bucles' }
    ],
    correctOption: 'b',
    explanation: 'var tiene ámbito de función, let y const tienen ámbito de bloque. const no permite reasignación.'
  },
  {
    id: 'js_2',
    topic: 'JavaScript Básico',
    text: '¿Qué es el hoisting en JavaScript?',
    options: [
      { id: 'a', text: 'Un tipo de variable' },
      { id: 'b', text: 'Mover variables y funciones al principio de su ámbito' },
      { id: 'c', text: 'Una forma de optimizar código' },
      { id: 'd', text: 'Un error de sintaxis' }
    ],
    correctOption: 'b',
    explanation: 'El hoisting es el comportamiento de JavaScript de mover declaraciones de variables y funciones al principio de su ámbito antes de la ejecución.'
  },
  {
    id: 'js_3',
    topic: 'JavaScript Avanzado',
    text: '¿Qué es una closure?',
    options: [
      { id: 'a', text: 'Una función que devuelve undefined' },
      { id: 'b', text: 'Una función que tiene acceso a variables de su función padre' },
      { id: 'c', text: 'Un tipo de error' },
      { id: 'd', text: 'Una declaración que cierra el programa' }
    ],
    correctOption: 'b',
    explanation: 'Una closure es una función que tiene acceso a variables de su función padre incluso después de que la función padre haya terminado.'
  },

  // React
  {
    id: 'react_1',
    topic: 'React Básico',
    text: '¿Cuál es la diferencia entre state y props?',
    options: [
      { id: 'a', text: 'No hay diferencia' },
      { id: 'b', text: 'State es mutable y local, props es inmutable y viene del padre' },
      { id: 'c', text: 'Props es más rápido que state' },
      { id: 'd', text: 'State solo se usa en class components' }
    ],
    correctOption: 'b',
    explanation: 'State es el estado interno de un componente que puede cambiar, mientras que props son datos que vienen del componente padre y son inmutables.'
  },
  {
    id: 'react_2',
    topic: 'React Básico',
    text: '¿Para qué sirve el hook useEffect?',
    options: [
      { id: 'a', text: 'Para efectos visuales solamente' },
      { id: 'b', text: 'Para manejar efectos secundarios después de que se renderiza el componente' },
      { id: 'c', text: 'Para cambiar el estado' },
      { id: 'd', text: 'Para hacer fetch de datos solo en el constructor' }
    ],
    correctOption: 'b',
    explanation: 'useEffect permite ejecutar código después de que el componente se renderiza, ideal para efectos secundarios como fetching de datos, suscripciones, etc.'
  },
  {
    id: 'react_3',
    topic: 'React Avanzado',
    text: '¿Qué es una key en una lista de React?',
    options: [
      { id: 'a', text: 'Un identificador único para ayudar a React a identificar qué elementos han cambiado' },
      { id: 'b', text: 'El índice del array' },
      { id: 'c', text: 'Una propiedad de CSS' },
      { id: 'd', text: 'El nombre de la variable' }
    ],
    correctOption: 'a',
    explanation: 'Las keys ayudan a React a identificar qué elementos han cambiado, se han añadido o se han eliminado, mejorando el rendimiento.'
  },

  // TypeScript
  {
    id: 'ts_1',
    topic: 'TypeScript Básico',
    text: '¿Cuál es la principal ventaja de usar TypeScript?',
    options: [
      { id: 'a', text: 'Hace que el código sea más lento' },
      { id: 'b', text: 'Proporciona tipado estático para detectar errores en tiempo de compilación' },
      { id: 'c', text: 'Es más fácil de aprender que JavaScript' },
      { id: 'd', text: 'Reemplaza completamente a JavaScript' }
    ],
    correctOption: 'b',
    explanation: 'TypeScript añade tipado estático a JavaScript, permitiendo detectar errores de tipo antes de ejecutar el código.'
  },
  {
    id: 'ts_2',
    topic: 'TypeScript Básico',
    text: '¿Qué es una interfaz en TypeScript?',
    options: [
      { id: 'a', text: 'Un tipo de variable' },
      { id: 'b', text: 'Un contrato que define la estructura de un objeto' },
      { id: 'c', text: 'Una clase' },
      { id: 'd', text: 'Una función' }
    ],
    correctOption: 'b',
    explanation: 'Una interfaz define un contrato que especifica qué propiedades y métodos debe tener un objeto.'
  },

  // CSS
  {
    id: 'css_1',
    topic: 'CSS Básico',
    text: '¿Qué es Flexbox?',
    options: [
      { id: 'a', text: 'Un framework de CSS' },
      { id: 'b', text: 'Un modelo de diseño para distribuir elementos en una sola dimensión' },
      { id: 'c', text: 'Un tipo de animación' },
      { id: 'd', text: 'Una variable de CSS' }
    ],
    correctOption: 'b',
    explanation: 'Flexbox es un modelo de diseño que facilita la distribución y alineación de elementos en contenedores, principalmente en una dimensión.'
  },
  {
    id: 'css_2',
    topic: 'CSS Avanzado',
    text: '¿Cuál es la diferencia entre position: relative y position: absolute?',
    options: [
      { id: 'a', text: 'No hay diferencia' },
      { id: 'b', text: 'relative es relativo al contenedor, absolute es relativo al documento' },
      { id: 'c', text: 'relative es relativo a su posición normal, absolute es relativo al padre posicionado' },
      { id: 'd', text: 'absolute es más lento' }
    ],
    correctOption: 'c',
    explanation: 'position: relative posiciona el elemento relativamente a su flujo normal, mientras que absolute lo posiciona relativamente al primer ancestro posicionado.'
  },

  // HTML
  {
    id: 'html_1',
    topic: 'HTML Básico',
    text: '¿Para qué sirve la etiqueta <meta charset="UTF-8">?',
    options: [
      { id: 'a', text: 'Para definir el título del documento' },
      { id: 'b', text: 'Para especificar la codificación de caracteres del documento' },
      { id: 'c', text: 'Para importar CSS' },
      { id: 'd', text: 'Para definir el idioma' }
    ],
    correctOption: 'b',
    explanation: 'La etiqueta meta con charset especifica la codificación de caracteres, permitiendo que el navegador renderice correctamente caracteres especiales y acentos.'
  },
  {
    id: 'html_2',
    topic: 'HTML Básico',
    text: '¿Cuál es la diferencia entre <div> y <section>?',
    options: [
      { id: 'a', text: 'No hay diferencia' },
      { id: 'b', text: 'section es más semántico y agrupa contenido relacionado' },
      { id: 'c', text: 'div es más rápido' },
      { id: 'd', text: 'section es obsoleto' }
    ],
    correctOption: 'b',
    explanation: 'section es un elemento semántico que agrupa contenido relacionado temáticamente, mientras que div es genérico sin significado semántico.'
  },

  // Seguridad Informática
  {
    id: 'seg_1',
    topic: 'Seguridad Informática',
    text: '¿Qué es el cifrado end-to-end?',
    options: [
      { id: 'a', text: 'Encriptar datos solo en el servidor' },
      { id: 'b', text: 'Cifrar mensajes de forma que solo el remitente y destinatario puedan leerlos' },
      { id: 'c', text: 'Un tipo de antivirus' },
      { id: 'd', text: 'Eliminar datos al finalizar la sesión' }
    ],
    correctOption: 'b',
    explanation: 'El cifrado end-to-end asegura que los mensajes estén encriptados desde el origen hasta el destino, siendo ilegibles para terceros incluyendo servidores intermedios.'
  },
  {
    id: 'seg_2',
    topic: 'Seguridad Informática',
    text: '¿Cuál es el propósito de un certificado SSL/TLS?',
    options: [
      { id: 'a', text: 'Aumentar la velocidad de internet' },
      { id: 'b', text: 'Establecer una conexión segura y encriptada entre cliente y servidor' },
      { id: 'c', text: 'Bloquear anuncios publicitarios' },
      { id: 'd', text: 'Guardar contraseñas en el navegador' }
    ],
    correctOption: 'b',
    explanation: 'Los certificados SSL/TLS permiten crear conexiones seguras y encriptadas, asegurando que la información transmitida no pueda ser interceptada.'
  },
  {
    id: 'seg_3',
    topic: 'Seguridad Informática',
    text: '¿Qué es la autenticación de dos factores (2FA)?',
    options: [
      { id: 'a', text: 'Usar dos contraseñas diferentes' },
      { id: 'b', text: 'Verificación de identidad usando dos métodos distintos' },
      { id: 'c', text: 'Cambiar contraseña cada dos días' },
      { id: 'd', text: 'Un tipo de firewall' }
    ],
    correctOption: 'b',
    explanation: 'La autenticación de dos factores requiere dos métodos de verificación distintos (ej: contraseña + código enviado al móvil) para aumentar la seguridad.'
  },

  // Bases de Datos
  {
    id: 'bd_1',
    topic: 'Ley Orgánica de la Policía Nacional del Perú',
    text: '¿Cuál es la diferencia entre SQL y NoSQL?',
    options: [
      { id: 'a', text: 'Son lo mismo' },
      { id: 'b', text: 'SQL es relacional con esquema fijo, NoSQL es no relacional con esquema flexible' },
      { id: 'c', text: 'NoSQL es más antiguo que SQL' },
      { id: 'd', text: 'SQL no se puede usar con JavaScript' }
    ],
    correctOption: 'b',
    explanation: 'SQL usa bases de datos relacionales con esquema predefinido, mientras que NoSQL usa bases de datos no relacionales con esquema flexible como documentos o clave-valor.'
  },
  {
    id: 'bd_2',
    topic: 'Bases de Datos',
    text: '¿Qué es una clave primaria?',
    options: [
      { id: 'a', text: 'La primera columna de una tabla' },
      { id: 'b', text: 'Un identificador único que identifica cada fila en una tabla' },
      { id: 'c', text: 'La contraseña de la base de datos' },
      { id: 'd', text: 'Un archivo de respaldo' }
    ],
    correctOption: 'b',
    explanation: 'Una clave primaria es un atributo o conjunto de atributos que identifican de manera única cada fila en una tabla de base de datos.'
  },
  {
    id: 'bd_3',
    topic: 'Bases de Datos',
    text: '¿Qué es una relación de uno a muchos?',
    options: [
      { id: 'a', text: 'Cuando una tabla tiene muchas columnas' },
      { id: 'b', text: 'Cuando un registro en una tabla puede estar relacionado con varios registros en otra tabla' },
      { id: 'c', text: 'Cuando hay muchos usuarios' },
      { id: 'd', text: 'Un tipo de contraseña' }
    ],
    correctOption: 'b',
    explanation: 'Una relación uno a muchos es cuando un registro de una tabla puede estar asociado con múltiples registros en otra tabla (ej: un autor con muchos libros).'
  }
]
