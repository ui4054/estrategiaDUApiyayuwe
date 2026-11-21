# 🌿 Tejiendo Saberes para Prevenir el Dengue
### Estrategia Pedagógica para la Inclusión y la Equidad · STEM+A, DUA y PEA
**Institución Educativa Técnico San Jacinto · Guachené y La Unión del Salado, Cauca**  
**Maestría en Educación STEM para el Desarrollo Social · Universidad Santo Tomás (2026)**

---

## 🌐 Despliegue en Línea (Live Site)

> [!IMPORTANT]
> **El sitio web interactivo de la propuesta pedagógica se encuentra desplegado y disponible en:**  
> 👉 **[Your site is live at https://ui4054.github.io/estrategiaDUApiyayuwe/](https://ui4054.github.io/estrategiaDUApiyayuwe/)**

---

## 👥 Equipo y Créditos Académicos

* **Equipo Investigador (Autores):**
  * Laura Leandra Bernal Caicedo
  * Silvia Marcela Martínez Pérez
  * Sandra Jimena Vásquez Marroquín
  * Miguel Alfonso Martínez
* **Dirección Académica:**
  * Mg. / Docente Julio César Bermúdez Restrepo
* **Institución:**
  * Universidad Santo Tomás · Facultad de Educación

---

## 🎯 Pregunta Curricular Orientadora

> *«¿Cómo podemos explicar a nuestras familias la transmisión del dengue y recomendar acciones para reducir los criaderos en recipientes con agua?»*

---

## 🧭 Recorrido por el Proyecto y Arquitectura del Sitio

El proyecto está diseñado bajo una arquitectura modular interactiva en HTML5, CSS3 semántico y JavaScript ES6+, cumpliendo con las pautas del **Diseño Universal para el Aprendizaje (DUA · CAST 2024)**, el enfoque **STEM+A** y el **Proyecto Etnoeducativo Afrocaucano (PEA)** en diálogo con el Pueblo Indígena Nasa y la Cultura Cafetera:

### 1. Sistema Transversal de Accesibilidad DUA
En todas las páginas de la plataforma se cuenta con una barra superior de accesibilidad activa:
* **Macrotipo DUA:** Ampliación tipográfica accesible para baja visión.
* **Alto Contraste y Regla Táctil:** Conmutación a modo de alta legibilidad y guía de lectura.
* **Lectura en Voz Alta:** Integración nativa con la API de síntesis de voz del navegador (`Web Speech API`).
* **Temas Interculturales:** Alternancia entre el tema *Pergamino Cafetero* (modo claro) y *Noche de Tambores* (modo oscuro).

### 2. Estructura de Páginas y Módulos
```
estrategiaDUApiyayuwe/
│
├── index.html                               # Landing Page, Marco DUA y Explorador Curricular
├── modulo01_teatro_epidemiologico.html      # Módulo 01: Dramatización y Ciclo del Dengue
├── modulo02_laboratorio_materiales.html     # Módulo 02: Capilaridad 2D y Prototipado de Cubiertas
├── modulo03_divulgacion_evaluacion.html     # Módulo 03: Divulgación, Ritmo Web Audio y Rúbrica
│
├── css/
│   └── styles.css                           # Sistema de diseño triétnico y responsive DUA
├── js/
│   ├── app.js                               # Controlador general, accesibilidad y navegación
│   └── simulators.js                        # Simulador físico 2D canvas, Chart.js, Web Audio y PDF
│
├── assets/
│   ├── guias/                               # Guías pedagógicas PDF descargables (01 a 04)
│   └── img/                                 # Esquemas, mapas interculturales e ilustraciones
└── fuentes/                                 # Documento Maestro PDF y Matriz Excel de 1.º a 5.º
```

---

## 📊 Matriz General de la Propuesta Pedagógica

A continuación se detalla la propuesta didáctica transversal estructurada en tres fases/módulos para estudiantes de **4.º grado de primaria**:

| Fase / Módulo | Dimensión STEM+A | Principio DUA (CAST 2024) | Enfoque Intercultural | Actividades y Herramientas Interactivas | Evidencia y Producto de Aprendizaje |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Módulo 01:<br>Teatro Epidemiológico** | **Ciencias (Biología):** Ciclo de vida de *Aedes aegypti* (huevo, larva, pupa, mosquito adulto) y mecanismo vectorial.<br>**Artes:** Dramatización escolar, expresión corporal y escenografía. | **Múltiples Formas de Compromiso:**<br>Pautas 7.2 y 8.3.<br>Elección de roles, guiones adaptados con pictogramas y macrotipo. | **Afro (Guachené / Unión del Salado):** Cuadrillas de *Tonga* cooperativa.<br>**Nasa:** Cuidado de la vida y la Madre Tierra (*Uma Kiwe*). | • Simulador de Guion Teatral interactivo en 3 escenas.<br>• Selector de personajes con tarjetas DUA.<br>• Cronómetro de escena para autorregulación. | Libreto adaptado representado en el aula y bitácora del ciclo biológico del vector. |
| **Módulo 02:<br>Laboratorio de Materiales y Capilaridad** | **Ciencias (Física):** Porosidad, tensión superficial e impermeabilidad.<br>**Matemáticas:** Medición en cm, 3 réplicas ($n=3$) y cálculo de la media aritmética insesgada ($\bar{x}$).<br>**Ingeniería:** Criterios de diseño para cubiertas herméticas y trampas. | **Múltiples Formas de Representación:**<br>Pautas 1.2, 1.3 y 3.2.<br>Reglas graduadas táctiles de alto contraste, tablas numéricas y modelos gráficos simultáneos. | **Cultura Cafetera y Campesina:** Cuidado meticuloso de tanques y albercas.<br>**Nasa:** El agua como ser vivo sagrado (*Yu*). | • Simulador Físico 2D en Canvas (dinámica de capilaridad $h(t) \propto \sqrt{t}$).<br>• Selector de materiales (Papel $\bar{x}=4.5\text{ cm}$, Tela $\bar{x}=6.0\text{ cm}$, Plástico $\bar{x}=0\text{ cm}$).<br>• Gráficas reactivas con Chart.js.<br>• Constructor de prototipos de tapas herméticas. | Tabla experimental diligenciada, media aritmética calculada y prototipo físico/virtual de cubierta sin aberturas. |
| **Módulo 03:<br>Divulgación Comunitaria y Evaluación** | **Tecnología & Artes:** Diseño gráfico de infografías DUA, rimado poético y música comunitaria.<br>**Matemáticas:** Comunicación de conclusiones estadísticas a la familia. | **Múltiples Formas de Acción y Expresión:**<br>Pautas 4.1, 5.1 y 6.2.<br>Multiplicidad de formatos (copla cantada, afiche visual, audio y PDF). | **Triétnico:** Filosofía *Ubuntu* ("Yo soy porque nosotros somos"), ritmo de tambor y marimba, convite veredal y tejido del Chumbe. | • Estudio creativo de divulgación (coplas/afiches).<br>• Sintetizador de audio en tiempo real con Web Audio API (marimba/bombo).<br>• Motor de generación de infografía escolar exportable a PDF vectorial.<br>• Rúbrica formativa interactiva DUA con gráfico radar de coevaluación. | Infografía comunitaria descargada/impresa, copla compartida con los hogares y rúbrica formativa concertada con la familia. |

---

## 🛠️ Herramientas y Recursos Descargables del Proyecto

1. **Guía 01:** [Teatro Epidemiológico y Trabajo en Tonga (PDF)](file:///c:/GITCITOS/presentacion/presentacion/assets/guias/Guia_01_Teatro_Epidemiologico_Tonga.pdf)
2. **Guía 02:** [Protocolo de Laboratorio de Materiales y Capilaridad (PDF)](file:///c:/GITCITOS/presentacion/presentacion/assets/guias/Guia_02_Protocolo_Laboratorio_Materiales.pdf)
3. **Guía 03:** [Divulgación Familiar, Coplas y Cuidado del Agua (PDF)](file:///c:/GITCITOS/presentacion/presentacion/assets/guias/Guia_03_Divulgacion_Familiar_y_Coplas.pdf)
4. **Guía 04:** [Rúbrica Formativa DUA y Ruta de 7 Operaciones (PDF)](file:///c:/GITCITOS/presentacion/presentacion/assets/guias/Guia_04_Rubrica_Formativa_DUA_Docente.pdf)
5. **Fuentes Maestras:**
   * Documento de Investigación: `fuentes/Estrategia DUA -Maestría Stem.pdf`
   * Matriz Curricular 1.º a 5.º: `fuentes/prototipo de planeación UDL + PROYECTO Transversal Ciencias Naturales.xlsx`
