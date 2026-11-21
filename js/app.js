/**
 * ============================================================================
 * APP.JS — Motor de Accesibilidad DUA, KaTeX y Componentes Interactivos STEM+A
 * Proyecto: ¡Aguas con el mosquito! — Institución Educativa Las Guacas (Corinto, Cauca)
 * Arquitectura en 3 Capas (Datos/Estado Puro -> Renderizado Reactivo -> Eventos DUA)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
   * CAPA 1: DATOS OFICIALES DEL EXCEL Y FUNCIONES PURAS DE ESTADO
   * ========================================================================== */

  /**
   * Datos exactos de la hoja `Matriz_General_1a5_Grados` del Excel maestro
   */
  const MATRIZ_GRADOS_DATA = {
    '1': {
      grado: '1.º Grado',
      edadPromedio: '6 a 7 años',
      nombreExperiencia: 'Exploradores del Agua Limpia en Mi Casa y Mi Escuela',
      areasSTEM: 'Ciencias Naturales + Artes Plásticas + Lenguaje Oral',
      saberPEA: 'El agua como fuente de vida en el territorio y reconocimiento sensorial de criaderos domésticos (baldes, materas y llantas).',
      redCerebralDUA: 'Red de Reconocimiento (El «Qué» del aprendizaje — Percepción multisensorial)',
      pautaDUA: 'Pauta 1: Proporcionar diferentes opciones para la percepción (pictogramas, canciones, recorridos táctiles y auditivos).',
      propositoCurricular: 'Identificar visual, auditiva y táctilmente recipientes que acumulan agua estancada en el hogar y la escuela, diferenciando agua limpia en movimiento de agua estancada con riesgo de larvas.',
      productoTonga: 'Mapa pictórico sonoro del patio escolar y ronda infantil preventiva contra el zancudo.',
      preguntaOrientadora: '¿Dónde se esconde el mosquito cuando llueve en nuestra vereda?'
    },
    '2': {
      grado: '2.º Grado',
      edadPromedio: '7 a 8 años',
      nombreExperiencia: 'Guardianes del Ciclo de Vida: ¿Quién Vive en el Charco?',
      areasSTEM: 'Ciencias Naturales + Matemáticas (Conteo y Tiempo) + Expresión Corporal',
      saberPEA: 'Ciclo biológico metamórfico del mosquito Aedes aegypti (huevo, larva, pupa y adulto) y conteo de días de desarrollo según el clima.',
      redCerebralDUA: 'Red Estratégica (El «Cómo» del aprendizaje — Acción y expresión corporal/gráfica)',
      pautaDUA: 'Pauta 4 y 5: Proporcionar múltiples medios físicos de acción, dramatización y construcción de secuencias temporales.',
      propositoCurricular: 'Ordenar y cuantificar en días las fases del ciclo de vida del mosquito transmisor del dengue, comprendiendo cómo interrumpir el paso de larva a zancudo adulto antes del séptimo día.',
      productoTonga: 'Rueda giratoria del ciclo biológico y dramatización corporal de las 4 etapas del Aedes aegypti.',
      preguntaOrientadora: '¿Cuántos días necesita una larva en el agua estancada para convertirse en zancudo volador?'
    },
    '3': {
      grado: '3.º Grado',
      edadPromedio: '8 a 9 años',
      nombreExperiencia: 'Detectives del Clima y Mapeo Comunitario de Criaderos en Corinto',
      areasSTEM: 'Ciencias Naturales + Matemáticas (Estadística y Croquis) + Ciencias Sociales',
      saberPEA: 'Relación entre lluvias, temperatura del norte del Cauca, relieve veredal y distribución espacial de puntos críticos de agua estancada.',
      redCerebralDUA: 'Red Afectiva y de Reconocimiento (Compromiso comunitario y comprensión de símbolos/tablas)',
      pautaDUA: 'Pauta 2 y 7: Clarificar vocabulario, símbolos cartográficos e intereses locales mediante investigación en minga.',
      propositoCurricular: 'Registrar en tablas de frecuencia y planos comunitarios los focos de agua estancada en la vereda Las Guacas, relacionando temporadas de lluvia y sol con el aumento del riesgo epidemiológico.',
      productoTonga: 'Croquis bioclimático de puntos críticos de la vereda y semáforo comunitario de prevención.',
      preguntaOrientadora: '¿Por qué después de los aguaceros seguidos de sol fuerte aparecen más zancudos en la vereda?'
    },
    '4': {
      grado: '4.º Grado (Foco Central)',
      edadPromedio: '9 a 10 años',
      nombreExperiencia: '¡Aguas con el mosquito! Teatro Epidemiológico, Laboratorio de Capilaridad y Divulgación en Tonga',
      areasSTEM: 'Ciencias Naturales + Matemáticas (Medición cm y Promedios) + Tecnología (Diseño de Prototipos) + Lenguaje y Artes',
      saberPEA: 'Transmisión vectorial del virus del dengue, propiedades físicas de los materiales (absorción por capilaridad e impermeabilidad) y comunicación preventiva intercultural.',
      redCerebralDUA: 'Integración de las 3 Redes DUA: Afectiva (Compromiso en Tonga), Reconocimiento (Modelado físico-matemático) y Estratégica (Prototipado y divulgación multimodal).',
      pautaDUA: 'Pautas 1, 3, 5, 7 y 8: Reglas táctiles de alto contraste, trabajo cooperativo en 4 roles de Tonga, experimentación guiada y expresión artística multimodal.',
      propositoCurricular: 'Explicar el mecanismo de transmisión del dengue mediante teatro comunitario, comprobar experimentalmente qué materiales (papel, tela, plástico) sirven para cubrir recipientes midiendo la absorción en centímetros, y divulgar soluciones preventivas adaptadas a la cultura del norte del Cauca.',
      productoTonga: 'Obra en 3 escenas + Informe experimental de capilaridad + Prototipo de cubierta/trampa + Campaña multimodal (Copla, Infografía, Feria o Podcast).',
      preguntaOrientadora: '¿Cómo podemos demostrar con ciencia, arte y trabajo en Tonga qué materiales protegen mejor el agua de nuestra comunidad frente al mosquito del dengue?'
    },
    '5': {
      grado: '5.º Grado',
      edadPromedio: '10 a 11 años',
      nombreExperiencia: 'Ingeniería Comunitaria y Vigilancia Epidemiológica Escolar Sostenible',
      areasSTEM: 'Tecnología e Ingeniería + Matemáticas (Proporciones y Tasas) + Ciencias Naturales + Ética Comunitaria',
      saberPEA: 'Sistemas de filtrado, diseño de ovitrampas ecológicas, análisis de tasas de incidencia y liderazgo en cabildos/juntas escolares de salud.',
      redCerebralDUA: 'Red Estratégica y Afectiva (Funciones ejecutivas, autorregulación y liderazgo comunitario)',
      pautaDUA: 'Pauta 6 y 9: Apoyar la planificación de proyectos, el monitoreo de metas colectivas y la autoevaluación reflexiva.',
      propositoCurricular: 'Diseñar, validar y sostener brigadas escolares de vigilancia epidemiológica y prototipos funcionales de control larvario, proyectando el impacto porcentual de la prevención comunitaria en Corinto.',
      productoTonga: 'Red de ovitrampas escolares monitoreadas + Plan de acción epidemiológico para el Cabildo y la Junta de Acción Comunal.',
      preguntaOrientadora: '¿Cómo logramos que toda la comunidad de Las Guacas mantenga el riesgo de dengue cerca de cero durante todo el año?'
    }
  };

  /**
   * Datos exactos de la hoja `Ruta_7_Operaciones_4G` del Excel maestro (Op. 1 a Op. 7)
   */
  const RUTA_7_OPERACIONES_DATA = {
    '1': {
      op: 'Operación 1',
      codigo: 'OP-01',
      titulo: 'Contextualización Territorial y Saberes Ancestrales (PEA)',
      moduloAsociado: 'Módulo 1 — Teatro Epidemiológico',
      tiempoEstimado: '45 min',
      redDUA: 'Red Afectiva (Compromiso e Identidad Cultural)',
      descripcion: 'Partimos de la realidad vivida en la vereda Las Guacas (Corinto, Cauca): el almacenamiento de agua lluvia en tanques, canecas y timbos, y los saberes de abuelas, mayores Nasa, comunidades afrodescendientes y familias campesinas cafeteras sobre las fiebres y el cuidado del patio.',
      actividadClave: 'Círculo de la palabra e inventario inicial de recipientes de agua en casa con apoyo de pictogramas, relatos orales y mapa veredal.',
      evidenciaAprendizaje: 'Reconocimiento de la problemática local del dengue conectada con las prácticas cotidianas de recolección de agua.'
    },
    '2': {
      op: 'Operación 2',
      codigo: 'OP-02',
      titulo: 'Conformación de la Tonga y Asignación de los 4 Roles Cooperativos',
      moduloAsociado: 'Transversal (Módulos 1, 2 y 3)',
      tiempoEstimado: '30 min',
      redDUA: 'Red Afectiva y Estratégica (Colaboración con Equidad)',
      descripcion: 'Organización de los equipos bajo el principio ancestral de la Tonga / Minga caucana, donde ningún estudiante trabaja aislado y cada fortaleza neurodiversa encuentra su lugar mediante 4 roles rotativos e interdependientes.',
      actividadClave: 'Elección consensuada de roles: Líder de Tonga, Guardián de Materiales, Registrador Científico y Relator Comunitario con insignias visuales y táctiles.',
      evidenciaAprendizaje: 'Acta visual de compromiso de la Tonga con responsabilidades claras para teatro, laboratorio y divulgación.'
    },
    '3': {
      op: 'Operación 3',
      codigo: 'OP-03',
      titulo: 'Dramatización Epidemiológica: «Armando las 3 Escenas en Tonga»',
      moduloAsociado: 'Módulo 1 — Teatro Epidemiológico',
      tiempoEstimado: '60 min',
      redDUA: 'Red de Reconocimiento y Expresión Corporal',
      descripcion: 'Comprensión de la cadena epidemiológica (Vector Aedes aegypti → Persona con virus → Persona sana expuesta → Síntomas de alerta y no automedicación) a través del teatro pedagógico estructurado en tres escenas secuenciales.',
      actividadClave: 'Puesta en escena de: Escena 1 (El encuentro en el agua estancada), Escena 2 (La cadena de picaduras y alerta de fiebre) y Escena 3 (La Tonga entra en acción tapando y limpiando).',
      evidenciaAprendizaje: 'Secuencia dramática completa que explica científicamente por qué el dengue no se contagia de persona a persona sino por el vector.'
    },
    '4': {
      op: 'Operación 4',
      codigo: 'OP-04',
      titulo: 'Formulación de Hipótesis y Protocolo Experimental de Materiales',
      moduloAsociado: 'Módulo 2 — Laboratorio de Materiales',
      tiempoEstimado: '45 min',
      redDUA: 'Red de Reconocimiento y Funciones Ejecutivas',
      descripcion: 'Planteamiento del reto científico: si tapamos un recipiente para evitar que la hembra Aedes aegypti ponga huevos, ¿qué pasa cuando llueve o el material toca el agua? Comparación de tres materiales cotidianos: Papel absorbente, Tela de algodón y Plástico PET.',
      actividadClave: 'Predicción en equipo y montaje de tiras de igual longitud sobre vasos con agua coloreada con anilina vegetal o café, activando reglas con marcas táctiles DUA.',
      evidenciaAprendizaje: 'Hipótesis registrada (escrita, dibujada o grabada en audio) y montaje experimental controlado.'
    },
    '5': {
      op: 'Operación 5',
      codigo: 'OP-05',
      titulo: 'Medición Física de Capilaridad y Cálculo de Promedios (x̄)',
      moduloAsociado: 'Módulo 2 — Laboratorio de Materiales',
      tiempoEstimado: '60 min',
      redDUA: 'Red de Reconocimiento Matemático (Representación Múltiple)',
      descripcion: 'Toma de 3 mediciones en centímetros (cm) del ascenso capilar del agua en cada material y cálculo de la media aritmética para reducir el error de observación y fundamentar decisiones con datos reales.',
      actividadClave: 'Registro de datos oficiales: Papel (4.5, 5.0, 4.0 cm → x̄ = 4.5 cm), Tela (6.0, 6.5, 5.5 cm → x̄ = 6.0 cm) y Plástico (0.0, 0.0, 0.0 cm → x̄ = 0.0 cm); análisis de la media general (3.5 cm).',
      evidenciaAprendizaje: 'Hoja de registro DUA diligenciada y gráfico comparativo de barras interpretado por la Tonga.'
    },
    '6': {
      op: 'Operación 6',
      codigo: 'OP-06',
      titulo: 'Ingeniería Escolar: Construcción de Cubierta Protectora y Trampa',
      moduloAsociado: 'Módulo 2 — Laboratorio de Materiales',
      tiempoEstimado: '60 min',
      redDUA: 'Red Estratégica (Construcción y Resolución de Problemas)',
      descripcion: 'Aplicación del hallazgo físico-matemático: dado que el plástico tiene absorción 0.0 cm (impermeable) y la tela/malla fina permite ventilación controlada si no toca el agua, se diseña una cubierta ajustada al borde del tanque y una trampa preventiva.',
      actividadClave: 'Ensamble y prueba de eficacia del prototipo evaluando tres variables críticas: material de cubierta, ajuste hermético del borde (aro/caucho) y sistema de control larvario.',
      evidenciaAprendizaje: 'Prototipo funcional validado con puntaje de eficacia ≥ 85% frente al ingreso del mosquito.'
    },
    '7': {
      op: 'Operación 7',
      codigo: 'OP-07',
      titulo: 'Divulgación Comunitaria Multimodal y Evaluación Formativa DUA',
      moduloAsociado: 'Módulo 3 — Divulgación y Evaluación DUA',
      tiempoEstimado: '60 min',
      redDUA: 'Integración de las 3 Redes DUA (Expresión Libre y Autoevaluación)',
      descripcion: 'Socialización de los resultados científicos a las familias de Las Guacas eligiendo el canal comunicativo que potencie los talentos del grupo, acompañada de evaluación formativa por niveles de desempeño con ajustes razonables.',
      actividadClave: 'Creación de Copla Caucana con ritmo de marimba/tambor, Infografía visual, Stand de Feria Científica o Reportaje Radial, y aplicación de la Rúbrica DUA de 6 criterios.',
      evidenciaAprendizaje: 'Producto comunicativo comunitario presentado y valoración integral en nivel Básico, Satisfactorio o Avanzado.'
    }
  };

  /**
   * Datos de los 4 Roles Cooperativos de la Tonga en los 3 Módulos
   */
  const ROLES_TONGA_DATA = {
    lider: {
      id: 'lider',
      nombre: 'Líder de Tonga (Coordinador/a de Minga)',
      icono: '🌿',
      lema: '«Caminamos juntos para que nadie se quede atrás»',
      fortalezaDUA: 'Liderazgo empático, gestión del tiempo, mediación de turnos de palabra y motivación grupal.',
      teatro: 'Dirige los ensayos de las 3 escenas, coordina las entradas de los personajes (Mosquito, Agua Estancada, Familia y Sabedor/a) y verifica que el mensaje de no automedicación quede claro.',
      laboratorio: 'Coordina el protocolo de inmersión con el cronómetro, verifica que todos los integrantes observen el ascenso del agua y lidera la discusión sobre por qué el plástico marcó 0.0 cm.',
      divulgacion: 'Presenta a la Tonga ante la comunidad o el cabildo escolar, articula la conclusión científica con el saber familiar y guía la autoevaluación en la rúbrica DUA.'
    },
    materiales: {
      id: 'materiales',
      nombre: 'Guardián/a de Materiales y Prototipos',
      icono: '🛠️',
      lema: '«Manos que cuidan, miden y construyen con precisión»',
      fortalezaDUA: 'Habilidad kinestésica, espacial, manipulación de instrumentos táctiles y orden experimental.',
      teatro: 'Prepara la utilería de las 3 escenas: las alas del mosquito Aedes aegypti (con rayas blancas en las patas), los recipientes simulados y el bastón o elementos de la brigada preventiva.',
      laboratorio: 'Corta y alinea las tiras de Papel, Tela y Plástico a la misma altura inicial, instala la regla táctil de alto contraste DUA y lidera el ensamble físico de la cubierta y la trampa.',
      divulgacion: 'Diseña los apoyos visuales o maquetas del stand de la Feria Escolar, o interpreta los instrumentos de percusión (tambor/marimba) para acompañar las coplas preventivas.'
    },
    registrador: {
      id: 'registrador',
      nombre: 'Registrador/a Científico/a y Matemático/a',
      icono: '📐',
      lema: '«Cada centímetro medido es una prueba para proteger la vida»',
      fortalezaDUA: 'Observación detallada, registro numérico/gráfico, uso de tablas, pictogramas o calculadoras de apoyo.',
      teatro: 'Verifica el guion secuencial de las 3 escenas (Inicio → Nudo epidemiológico → Desenlace preventivo) y lleva el conteo de días del ciclo del mosquito mencionados en la obra.',
      laboratorio: 'Anota las 3 mediciones en centímetros de cada material (Papel: 4.5, 5.0, 4.0 | Tela: 6.0, 6.5, 5.5 | Plástico: 0, 0, 0), calcula los promedios x̄ y comprueba la gráfica comparativa.',
      divulgacion: 'Incorpora las cifras reales del experimento (0.0 cm en plástico vs. 6.0 cm en tela) dentro de la infografía, reportaje o copla para que el mensaje comunitario tenga respaldo científico.'
    },
    relator: {
      id: 'relator',
      nombre: 'Relator/a y Comunicador/a Comunitario/a',
      icono: '📣',
      lema: '«La ciencia florece cuando habla el idioma de nuestra vereda»',
      fortalezaDUA: 'Expresión oral, poética, corporal, bilingüe/intercultural (Nasa Yuwe / tradición oral afro y campesina).',
      teatro: 'Narra la introducción y la moraleja epidemiológica de la obra, conectando la historia con los casos reales de cuidado del agua en la vereda Las Guacas.',
      laboratorio: 'Formula en voz alta o en formato multimodal la conclusión del experimento: explica por qué un material poroso absorbe agua por capilaridad y por qué el plástico impermeabiliza el tanque.',
      divulgacion: 'Entona las coplas caucanas, locuta el reportaje comunitario o guía al público visitante por la infografía asegurándose de que niños, jóvenes y abuelos comprendan cómo tapar los tanques.'
    }
  };

  /**
   * Estado persistente de accesibilidad DUA
   */
  const STORAGE_KEYS = {
    LARGE_TEXT: 'stem_dua_large_text',
    HIGH_CONTRAST: 'stem_dua_high_contrast',
    THEME: 'stem_dua_theme'
  };

  function getSavedBoolean(key, defaultVal = false) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultVal;
      return raw === 'true';
    } catch (_) {
      return defaultVal;
    }
  }

  function getSavedString(key, defaultVal = 'light') {
    try {
      return window.localStorage.getItem(key) || defaultVal;
    } catch (_) {
      return defaultVal;
    }
  }

  function saveSetting(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (_) {
      // Ignorar si localStorage está restringido
    }
  }

  /* ==========================================================================
   * CAPA 2: RENDERIZADO REACTIVO DEL DOM, KATEX Y ACCESIBILIDAD DUA
   * ========================================================================== */

  /**
   * Inicializa KaTeX (`renderMathInElement`) en el elemento dado o en `document.body`
   */
  function initKaTeX(targetEl) {
    const root = targetEl || document.body;
    if (!root) return;

    if (typeof window.renderMathInElement === 'function') {
      try {
        window.renderMathInElement(root, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        });
      } catch (err) {
        console.warn('KaTeX render warning:', err);
      }
    }
  }

  // Exponer globalmente para que simuladores o pestañas re-rendericen fórmulas dinámicas
  window.reRenderMath = initKaTeX;

  /**
   * Aplica el estado de letra ampliada DUA (`body.dua-large-text`)
   */
  function applyLargeTextState(isLarge) {
    document.body.classList.toggle('dua-large-text', isLarge);
    document.documentElement.classList.toggle('dua-large-text', isLarge);
    const btn = document.getElementById('btnFontIncrease');
    if (btn) {
      btn.setAttribute('aria-pressed', String(isLarge));
      btn.classList.toggle('active', isLarge);
      btn.title = isLarge
        ? 'Desactivar modo de letra ampliada DUA'
        : 'Activar modo de letra ampliada DUA (A+)';
    }
    saveSetting(STORAGE_KEYS.LARGE_TEXT, isLarge);
  }

  /**
   * Aplica el estado de alto contraste / regla táctil DUA (`body.dua-high-contrast`)
   */
  function applyHighContrastState(isHighContrast) {
    document.body.classList.toggle('dua-high-contrast', isHighContrast);
    document.documentElement.classList.toggle('dua-high-contrast', isHighContrast);
    const btn = document.getElementById('btnHighContrast');
    if (btn) {
      btn.setAttribute('aria-pressed', String(isHighContrast));
      btn.classList.toggle('active', isHighContrast);
      btn.title = isHighContrast
        ? 'Desactivar alto contraste y bordes táctiles DUA'
        : 'Activar alto contraste y regla táctil DUA';
    }
    // Sincronizar con el toggle de regla táctil del Módulo 2 si está presente
    const toggleRegla = document.getElementById('toggleReglaTactil');
    if (toggleRegla && toggleRegla.checked !== isHighContrast) {
      toggleRegla.checked = isHighContrast;
      toggleRegla.dispatchEvent(new Event('change', { bubbles: true }));
    }
    saveSetting(STORAGE_KEYS.HIGH_CONTRAST, isHighContrast);
  }

  /**
   * Aplica el tema visual:
   * - 'light': "Pergamino Cafetero Intercultural"
   * - 'dark' : "Noche de Tambores y Chumbe"
   */
  function applyThemeState(theme) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    const isDark = normalized === 'dark';

    document.documentElement.setAttribute('data-theme', normalized);
    document.body.setAttribute('data-theme', normalized);
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('theme-dark', isDark);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.classList.toggle('active', isDark);
      const labelSpan = btn.querySelector('.theme-label, .btn-label');
      const iconSpan = btn.querySelector('.theme-icon, .btn-icon');
      if (labelSpan) {
        labelSpan.textContent = isDark ? 'Noche de Tambores' : 'Pergamino Cafetero';
      } else if (!btn.children.length || btn.children.length === 0) {
        btn.textContent = isDark ? '☀️ Tema Claro' : '🌙 Tema Oscuro';
      }
      if (iconSpan) {
        iconSpan.textContent = isDark ? '☀️' : '🌙';
      }
      btn.title = isDark
        ? 'Tema actual: Noche de Tambores y Chumbe (Clic para cambiar a Pergamino Cafetero)'
        : 'Tema actual: Pergamino Cafetero Intercultural (Clic para cambiar a Noche de Tambores)';
    }

    saveSetting(STORAGE_KEYS.THEME, normalized);

    // Notificar a los gráficos de Chart.js para adaptar colores de texto/rejilla sin parpadeo
    window.dispatchEvent(new CustomEvent('stem:themechange', { detail: { theme: normalized } }));
  }

  /**
   * Lectura en voz alta DUA con Web Speech API (`window.speechSynthesis`)
   */
  let isCurrentlyReading = false;

  function updateReadAloudButtonUI(reading) {
    isCurrentlyReading = reading;
    const btn = document.getElementById('btnReadAloud');
    if (!btn) return;

    btn.setAttribute('aria-pressed', String(reading));
    btn.classList.toggle('active', reading);
    btn.classList.toggle('is-speaking', reading);

    const labelEl = btn.querySelector('.read-label, .btn-label');
    const iconEl = btn.querySelector('.read-icon, .btn-icon');
    if (labelEl) {
      labelEl.textContent = reading ? 'Detener lectura' : 'Leer en voz alta';
    } else if (!btn.children.length) {
      btn.textContent = reading ? '⏹ Detener lectura' : '🔊 Leer en voz alta';
    }
    if (iconEl) {
      iconEl.textContent = reading ? '⏹' : '🔊';
    }
  }

  function extractReadableText() {
    const selectors = [
      '[data-read-aloud-summary]',
      '.module-hero',
      '.hero-section',
      'main',
      '#mainContent',
      'article'
    ];
    const parts = [];
    const title = document.querySelector('h1');
    if (title) {
      parts.push(title.innerText.trim());
    }
    const lead = document.querySelector('.hero-subtitle, .module-lead, .lead, header p');
    if (lead) {
      parts.push(lead.innerText.trim());
    }
    const activeInfografia = document.getElementById('posterInfografiaActiva');
    if (activeInfografia && activeInfografia.innerText) {
      parts.push('Infografía activa: ' + activeInfografia.innerText.replace(/\s+/g, ' ').trim());
    }

    const mainEl = document.querySelector('main') || document.body;
    const headingsAndParas = mainEl.querySelectorAll('h2, h3, .dua-summary, .callout, p');
    let charCount = 0;
    headingsAndParas.forEach((node) => {
      if (charCount > 1400) return;
      const text = (node.innerText || '').replace(/\s+/g, ' ').trim();
      if (text.length > 20 && !parts.includes(text)) {
        parts.push(text);
        charCount += text.length;
      }
    });

    if (parts.length === 0) {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText) {
          parts.push(el.innerText.replace(/\s+/g, ' ').trim().slice(0, 1200));
          break;
        }
      }
    }

    return parts.join('. ');
  }

  function toggleReadAloud() {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura en voz alta (Web Speech API).');
      return;
    }

    const synth = window.speechSynthesis;
    if (synth.speaking || isCurrentlyReading) {
      synth.cancel();
      updateReadAloudButtonUI(false);
      return;
    }

    const textToRead = extractReadableText();
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    const voices = synth.getVoices ? synth.getVoices() : [];
    const preferredVoice =
      voices.find((v) => /es[-_]CO/i.test(v.lang)) ||
      voices.find((v) => /es[-_](MX|419|LA|AR|PE|EC|VE)/i.test(v.lang)) ||
      voices.find((v) => /^es/i.test(v.lang));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = 'es-CO';
    }
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    utterance.onstart = function () {
      updateReadAloudButtonUI(true);
    };
    utterance.onend = function () {
      updateReadAloudButtonUI(false);
    };
    utterance.onerror = function () {
      updateReadAloudButtonUI(false);
    };

    synth.cancel();
    synth.speak(utterance);
    updateReadAloudButtonUI(true);
  }

  /**
   * Renderiza el panel del Explorador de 1.º a 5.º Grado (`#gradoPanelContent`)
   */
  function renderGradoPanel(gradoKey) {
    const key = String(gradoKey).replace(/[^\d]/g, '') || '4';
    const data = MATRIZ_GRADOS_DATA[key] || MATRIZ_GRADOS_DATA['4'];
    const panel = document.getElementById('gradoPanelContent');

    // Actualizar estado activo de los botones `.grado-tab-btn[data-grado]`
    document.querySelectorAll('.grado-tab-btn[data-grado]').forEach((btn) => {
      const btnKey = String(btn.getAttribute('data-grado')).replace(/[^\d]/g, '');
      const isSelected = btnKey === key;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
      btn.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    if (!panel) return;

    const isFocoCuarto = key === '4';
    panel.innerHTML = `
      <div class="grado-card-detail ${isFocoCuarto ? 'grado-foco-destacado' : ''}" data-grado-activo="${key}">
        <div class="grado-detail-header">
          <div class="grado-badges-row">
            <span class="badge badge-grado">${data.grado}</span>
            <span class="badge badge-edad">👧👦 ${data.edadPromedio}</span>
            ${isFocoCuarto ? '<span class="badge badge-foco">⭐ Grado Foco de los 3 Módulos Interactivos</span>' : ''}
          </div>
          <h3 class="grado-experiencia-title">${data.nombreExperiencia}</h3>
          <p class="grado-pregunta-orientadora"><strong>Pregunta orientadora:</strong> <em>${data.preguntaOrientadora}</em></p>
        </div>

        <div class="grado-detail-grid">
          <div class="grado-meta-box">
            <span class="meta-label">🔬 Áreas STEM+A Integradas</span>
            <p class="meta-value">${data.areasSTEM}</p>
          </div>
          <div class="grado-meta-box">
            <span class="meta-label">🌱 Saber del Proyecto Educativo Ambiental (PEA)</span>
            <p class="meta-value">${data.saberPEA}</p>
          </div>
          <div class="grado-meta-box">
            <span class="meta-label">🧠 Red Cerebral DUA Activada</span>
            <p class="meta-value">${data.redCerebralDUA}</p>
          </div>
          <div class="grado-meta-box">
            <span class="meta-label">♿ Pauta DUA Aplicada</span>
            <p class="meta-value">${data.pautaDUA}</p>
          </div>
        </div>

        <div class="grado-proposito-box">
          <div class="proposito-item">
            <strong>🎯 Propósito Curricular:</strong>
            <p>${data.propositoCurricular}</p>
          </div>
          <div class="proposito-item">
            <strong>🤝 Producto Colectivo de la Tonga:</strong>
            <p>${data.productoTonga}</p>
          </div>
        </div>
      </div>
    `;

    initKaTeX(panel);
  }

  /**
   * Renderiza el detalle del Stepper de las 7 Operaciones Curriculares (`#opStepDetail`)
   */
  function renderOperacionStep(opKey) {
    const key = String(opKey).replace(/[^\d]/g, '') || '1';
    const data = RUTA_7_OPERACIONES_DATA[key] || RUTA_7_OPERACIONES_DATA['1'];
    const detailContainer = document.getElementById('opStepDetail');

    // Actualizar botones `.op-step-btn[data-op]`
    document.querySelectorAll('.op-step-btn[data-op]').forEach((btn) => {
      const btnKey = String(btn.getAttribute('data-op')).replace(/[^\d]/g, '');
      const isSelected = btnKey === key;
      const isCompleted = parseInt(btnKey, 10) < parseInt(key, 10);
      btn.classList.toggle('active', isSelected);
      btn.classList.toggle('completed', isCompleted);
      btn.setAttribute('aria-selected', String(isSelected));
      btn.setAttribute('aria-current', isSelected ? 'step' : 'false');
    });

    if (!detailContainer) return;

    const currentNum = parseInt(key, 10);
    const prevOp = currentNum > 1 ? currentNum - 1 : 7;
    const nextOp = currentNum < 7 ? currentNum + 1 : 1;

    detailContainer.innerHTML = `
      <div class="op-detail-card" data-op-activa="${key}">
        <div class="op-detail-header">
          <div class="op-badges">
            <span class="badge badge-op-code">${data.codigo} · ${data.op} de 7</span>
            <span class="badge badge-op-modulo">📚 ${data.moduloAsociado}</span>
            <span class="badge badge-op-tiempo">⏱️ ${data.tiempoEstimado}</span>
          </div>
          <h3 class="op-detail-title">${data.titulo}</h3>
          <p class="op-detail-dua"><strong>🧠 Enfoque Neurodiverso DUA:</strong> ${data.redDUA}</p>
        </div>

        <p class="op-detail-desc">${data.descripcion}</p>

        <div class="op-detail-columns">
          <div class="op-box">
            <strong>🛠️ Actividad Clave en Tonga:</strong>
            <p>${data.actividadClave}</p>
          </div>
          <div class="op-box">
            <strong>✅ Evidencia de Aprendizaje:</strong>
            <p>${data.evidenciaAprendizaje}</p>
          </div>
        </div>

        <div class="op-stepper-nav">
          <button type="button" class="btn btn-secondary btn-sm op-nav-trigger" data-target-op="${prevOp}" aria-label="Ir a la operación anterior (${prevOp})">
            ← Operación ${prevOp}
          </button>
          <span class="op-progress-indicator">Paso ${currentNum} de 7 en la Ruta Metodológica</span>
          <button type="button" class="btn btn-primary btn-sm op-nav-trigger" data-target-op="${nextOp}" aria-label="Ir a la siguiente operación (${nextOp})">
            Operación ${nextOp} →
          </button>
        </div>
      </div>
    `;

    // Enlazar botones internos de avance/retroceso
    detailContainer.querySelectorAll('.op-nav-trigger').forEach((navBtn) => {
      navBtn.addEventListener('click', function () {
        const target = this.getAttribute('data-target-op');
        renderOperacionStep(target);
      });
    });

    initKaTeX(detailContainer);
  }

  /**
   * Normaliza la clave del rol de la Tonga para admitir variantes (`lider`, `1`, `materiales`, etc.)
   */
  function normalizeRoleKey(rawRole) {
    const val = String(rawRole || '').toLowerCase().trim();
    if (val.includes('lider') || val.includes('líder') || val.includes('coordinador') || val === '1') {
      return 'lider';
    }
    if (val.includes('material') || val.includes('guardian') || val.includes('guardián') || val.includes('prototipo') || val === '2') {
      return 'materiales';
    }
    if (val.includes('registra') || val.includes('cientifico') || val.includes('científico') || val.includes('matematic') || val === '3') {
      return 'registrador';
    }
    if (val.includes('relator') || val.includes('comunica') || val.includes('vocero') || val === '4') {
      return 'relator';
    }
    return 'lider';
  }

  /**
   * Renderiza y actualiza la selección interactiva de los 4 Roles de la Tonga (`.tonga-role-card[data-role]`)
   */
  function selectTongaRole(rawRoleKey) {
    const roleKey = normalizeRoleKey(rawRoleKey);
    const data = ROLES_TONGA_DATA[roleKey] || ROLES_TONGA_DATA.lider;

    document.querySelectorAll('.tonga-role-card[data-role]').forEach((card) => {
      const cardKey = normalizeRoleKey(card.getAttribute('data-role'));
      const isSelected = cardKey === roleKey;
      card.classList.toggle('active', isSelected);
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-pressed', String(isSelected));
      card.setAttribute('aria-expanded', String(isSelected));

      // Si la tarjeta tiene un contenedor interno `.role-dynamic-detail` o similar, lo actualizamos
      let inlineDetail = card.querySelector('.tonga-role-inline-detail');
      if (!document.getElementById('tongaRoleDetail') && ! card.querySelector('.role-responsibilities')) {
        if (!inlineDetail) {
          inlineDetail = document.createElement('div');
          inlineDetail.className = 'tonga-role-inline-detail';
          card.appendChild(inlineDetail);
        }
        inlineDetail.style.display = isSelected ? 'block' : 'none';
        inlineDetail.innerHTML = `
          <hr class="role-divider" />
          <p class="role-lema"><em>${data.lema}</em></p>
          <ul class="role-module-list">
            <li><strong>🎭 En Teatro (Mód. 1):</strong> ${data.teatro}</li>
            <li><strong>🧪 En Laboratorio (Mód. 2):</strong> ${data.laboratorio}</li>
            <li><strong>📣 En Divulgación (Mód. 3):</strong> ${data.divulgacion}</li>
          </ul>
        `;
      }
    });

    // Si existe un panel dedicado `#tongaRoleDetail` en la página, actualizarlo con riqueza visual
    const detailPanel = document.getElementById('tongaRoleDetail');
    if (detailPanel) {
      detailPanel.innerHTML = `
        <div class="tonga-role-detail-panel" data-role-active="${data.id}">
          <div class="tonga-role-detail-header">
            <span class="tonga-role-big-icon" aria-hidden="true">${data.icono}</span>
            <div>
              <h4 class="tonga-role-detail-title">${data.nombre}</h4>
              <p class="tonga-role-detail-lema">${data.lema}</p>
            </div>
          </div>
          <p class="tonga-role-dua-strength"><strong>♿ Fortaleza Neurodiversa DUA:</strong> ${data.fortalezaDUA}</p>
          <div class="tonga-role-modules-grid">
            <div class="tonga-role-mod-box">
              <h5>🎭 Misión en Módulo 1 (Teatro Epidemiológico)</h5>
              <p>${data.teatro}</p>
            </div>
            <div class="tonga-role-mod-box">
              <h5>🧪 Misión en Módulo 2 (Laboratorio de Capilaridad)</h5>
              <p>${data.laboratorio}</p>
            </div>
            <div class="tonga-role-mod-box">
              <h5>📣 Misión en Módulo 3 (Divulgación y Rúbrica DUA)</h5>
              <p>${data.divulgacion}</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  /* ==========================================================================
   * CAPA 3: BINDING DE EVENTOS Y SOPORTE DE TECLADO / ACCESIBILIDAD DUA
   * ========================================================================== */

  function bindAccessibilityControls() {
    // Restaurar preferencias guardadas en localStorage
    const savedLargeText = getSavedBoolean(STORAGE_KEYS.LARGE_TEXT, false);
    const savedHighContrast = getSavedBoolean(STORAGE_KEYS.HIGH_CONTRAST, false);
    const savedTheme = getSavedString(STORAGE_KEYS.THEME, 'light');

    applyLargeTextState(savedLargeText);
    applyHighContrastState(savedHighContrast);
    applyThemeState(savedTheme);

    // 1. Botón Aumento de Fuente (#btnFontIncrease)
    const btnFont = document.getElementById('btnFontIncrease');
    if (btnFont) {
      btnFont.addEventListener('click', function () {
        const nextState = !document.body.classList.contains('dua-large-text');
        applyLargeTextState(nextState);
      });
    }

    // 2. Botón Alto Contraste / Regla Táctil (#btnHighContrast)
    const btnContrast = document.getElementById('btnHighContrast');
    if (btnContrast) {
      btnContrast.addEventListener('click', function () {
        const nextState = !document.body.classList.contains('dua-high-contrast');
        applyHighContrastState(nextState);
      });
    }

    // 3. Botón Leer en Voz Alta (#btnReadAloud)
    const btnRead = document.getElementById('btnReadAloud');
    if (btnRead) {
      btnRead.addEventListener('click', toggleReadAloud);
    }

    // 4. Botón Alternar Tema Claro / Oscuro (#themeToggleBtn)
    const btnTheme = document.getElementById('themeToggleBtn');
    if (btnTheme) {
      btnTheme.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyThemeState(nextTheme);
      });
    }
  }

  function bindLandingInteractiveComponents() {
    // 1. Pestañas de 1.º a 5.º Grado (`.grado-tab-btn[data-grado]`)
    const gradoBtns = Array.from(document.querySelectorAll('.grado-tab-btn[data-grado]'));
    if (gradoBtns.length > 0) {
      gradoBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
          renderGradoPanel(this.getAttribute('data-grado'));
        });

        // Navegación accesible con flechas Izquierda / Derecha
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const nextIdx = (idx + dir + gradoBtns.length) % gradoBtns.length;
            gradoBtns[nextIdx].focus();
            renderGradoPanel(gradoBtns[nextIdx].getAttribute('data-grado'));
          }
        });
      });

      // Inicializar con el botón que tenga `.active` o por defecto 4.º Grado (o el primero)
      const activeGradoBtn =
        document.querySelector('.grado-tab-btn.active[data-grado]') ||
        document.querySelector('.grado-tab-btn[data-grado="4"]') ||
        gradoBtns[0];
      if (activeGradoBtn) {
        renderGradoPanel(activeGradoBtn.getAttribute('data-grado'));
      }
    }

    // 2. Stepper de las 7 Operaciones Curriculares (`.op-step-btn[data-op]`)
    const opBtns = Array.from(document.querySelectorAll('.op-step-btn[data-op]'));
    if (opBtns.length > 0) {
      opBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
          renderOperacionStep(this.getAttribute('data-op'));
        });

        btn.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const nextIdx = (idx + dir + opBtns.length) % opBtns.length;
            opBtns[nextIdx].focus();
            renderOperacionStep(opBtns[nextIdx].getAttribute('data-op'));
          }
        });
      });

      const activeOpBtn =
        document.querySelector('.op-step-btn.active[data-op]') || opBtns[0];
      if (activeOpBtn) {
        renderOperacionStep(activeOpBtn.getAttribute('data-op'));
      }
    }

    // 3. Tarjetas de los 4 Roles de la Tonga (`.tonga-role-card[data-role]`)
    const roleCards = Array.from(document.querySelectorAll('.tonga-role-card[data-role]'));
    if (roleCards.length > 0) {
      roleCards.forEach((card, idx) => {
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
        if (!card.hasAttribute('role')) {
          card.setAttribute('role', 'button');
        }

        card.addEventListener('click', function () {
          selectTongaRole(this.getAttribute('data-role'));
        });

        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectTongaRole(this.getAttribute('data-role'));
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const nextIdx = (idx + dir + roleCards.length) % roleCards.length;
            roleCards[nextIdx].focus();
            selectTongaRole(roleCards[nextIdx].getAttribute('data-role'));
          }
        });
      });

      const activeRoleCard =
        document.querySelector('.tonga-role-card.active[data-role]') || roleCards[0];
      if (activeRoleCard) {
        selectTongaRole(activeRoleCard.getAttribute('data-role'));
      }
    }

    // 4. Gráfico de Distribución Temporal y Pedagógica en Landing Page (#chartPanoramaLanding)
    const landingCanvas = document.getElementById('chartPanoramaLanding');
    if (landingCanvas && typeof Chart !== 'undefined') {
      const isDark = document.body.classList.contains('dark-theme');
      const textColor = isDark ? '#f7efe6' : '#231512';
      const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(35,21,18,0.1)';

      const landingChart = new Chart(landingCanvas, {
        type: 'bar',
        data: {
          labels: [
            'Sesión 1: Teatro Epidemiológico (60 min)',
            'Sesión 2: Laboratorio y Cubiertas (120 min)',
            'Sesión 3: Divulgación y Familia (60 min)'
          ],
          datasets: [
            {
              label: 'Activación y Saberes Familiares (min)',
              data: [10, 20, 15],
              backgroundColor: '#d97706'
            },
            {
              label: 'Indagación / Creación en Tonga (min)',
              data: [35, 75, 30],
              backgroundColor: '#b91c1c'
            },
            {
              label: 'Síntesis Científica y Prototipado (min)',
              data: [15, 25, 15],
              backgroundColor: '#15803d'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              ticks: { color: textColor, font: { weight: '600' } },
              grid: { color: gridColor }
            },
            y: {
              stacked: true,
              title: { display: true, text: 'Duración Pedagógica (Minutos)', color: textColor },
              ticks: { color: textColor },
              grid: { color: gridColor }
            }
          },
          plugins: {
            legend: { labels: { color: textColor } }
          }
        }
      });

      window.addEventListener('stem:themechange', function () {
        const darkNow = document.body.classList.contains('dark-theme');
        const newColor = darkNow ? '#f7efe6' : '#231512';
        landingChart.options.scales.x.ticks.color = newColor;
        landingChart.options.scales.y.ticks.color = newColor;
        landingChart.options.scales.y.title.color = newColor;
        landingChart.options.plugins.legend.labels.color = newColor;
        landingChart.update('none');
      });
    }
  }

  /**
   * Inicialización general cuando el DOM está listo
   */
  function initApp() {
    bindAccessibilityControls();
    bindLandingInteractiveComponents();
    initKaTeX(document.body);

    // Re-intentar KaTeX cuando el script defer de auto-render termine de cargar si aún no estaba listo
    window.addEventListener('load', function () {
      initKaTeX(document.body);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
