// Variables globales
        let conversationHistory = [];
        let isTyping = false;
        let currentContext = '';

        // Base de datos mejorada de soluciones
        const solutions = {
            'no-enciende': {
                title: '🔌 Computador no enciende',
                steps: [
                    'Verificar que el cable de alimentación esté bien conectado tanto al computador como al tomacorriente',
                    'Probar con un tomacorriente diferente para descartar problemas eléctricos',
                    'Si es un portátil, verificar que la batería tenga carga o conectar el cargador',
                    'Revisar el botón de encendido, asegurándose de mantenerlo presionado por 3-5 segundos',
                    'Desconectar todos los dispositivos USB y periféricos, luego intentar encender',
                    'Si tiene fuente de poder externa, verificar que el LED indicador esté encendido',
                    'En caso de persistir, puede ser un problema de fuente de poder o placa madre - contactar servicio técnico'
                ]
            },
            'sobrecalentamiento': {
                title: '🔥 Sobrecalentamiento del equipo',
                steps: [
                    'Apagar inmediatamente el equipo y dejarlo enfriar por 30 minutos',
                    'Verificar que las rejillas de ventilación no estén obstruidas por polvo o objetos',
                    'Limpiar las rejillas con aire comprimido o un pincel suave',
                    'Asegurar que el equipo esté en una superficie plana y dura, no sobre camas o sofás',
                    'Verificar que los ventiladores internos estén funcionando (se debe escuchar el ruido)',
                    'Revisar el administrador de tareas para identificar procesos que consuman mucha CPU',
                    'Considerar usar una base refrigerante para portátiles',
                    'Si persiste, puede necesitar cambio de pasta térmica - contactar técnico especializado'
                ]
            },
            'ruidos-extraños': {
                title: '🔊 Ruidos extraños en el equipo',
                steps: [
                    'Identificar el tipo de ruido: clicks, chirridos, zumbidos o golpes',
                    'Si son clicks repetitivos, puede ser el disco duro - hacer respaldo inmediato de datos importantes',
                    'Para zumbidos o ruidos de ventilador, limpiar las aspas con aire comprimido',
                    'Si el ruido viene del disco duro, ejecutar chkdsk para verificar errores',
                    'Revisar que no haya cables sueltos que toquen los ventiladores',
                    'Usar software de diagnóstico como CrystalDiskInfo para verificar salud del disco',
                    'Si los ruidos persisten o empeoran, apagar el equipo y contactar servicio técnico',
                    'Considerar reemplazar componentes defectuosos antes de que fallen completamente'
                ]
            },
            'pantalla-azul': {
                title: '💙 Pantalla azul de la muerte (BSOD)',
                steps: [
                    'Anotar el código de error que aparece en la pantalla azul',
                    'Reiniciar el equipo y verificar si el problema se repite',
                    'Iniciar en modo seguro: presionar F8 durante el arranque',
                    'Desinstalar software recientemente instalado que pueda estar causando conflictos',
                    'Actualizar todos los controladores de dispositivos',
                    'Ejecutar sfc /scannow en símbolo del sistema como administrador',
                    'Verificar la memoria RAM con la herramienta de diagnóstico de Windows',
                    'Si persiste, buscar el código de error específico en línea para soluciones específicas',
                    'Considerar restaurar el sistema a un punto anterior cuando funcionaba correctamente'
                ]
            },
            'lento': {
                title: '🐌 Computador muy lento',
                steps: [
                    'Abrir el Administrador de tareas (Ctrl+Shift+Esc) para identificar procesos que consuman recursos',
                    'Desinstalar programas que no uses desde Panel de Control > Programas',
                    'Ejecutar limpieza de disco para eliminar archivos temporales',
                    'Deshabilitar programas de inicio innecesarios en la configuración del sistema',
                    'Ejecutar un análisis completo con tu antivirus',
                    'Verificar que tengas al menos 15% de espacio libre en el disco duro',
                    'Actualizar controladores de dispositivos, especialmente gráficos',
                    'Considerar instalar más RAM si constantemente usas más del 80%',
                    'Desfragmentar el disco duro si usas Windows en HDD (no necesario para SSD)'
                ]
            },
            'programas-no-abren': {
                title: '❌ Los programas no abren',
                steps: [
                    'Intentar ejecutar el programa como administrador (click derecho > Ejecutar como administrador)',
                    'Verificar si el problema ocurre con todos los programas o solo algunos específicos',
                    'Reiniciar el equipo para limpiar procesos que puedan estar interfiriendo',
                    'Actualizar el programa problemático a la última versión',
                    'Verificar compatibilidad del programa con tu versión de Windows',
                    'Ejecutar el solucionador de problemas de compatibilidad de Windows',
                    'Desinstalar y reinstalar el programa problemático',
                    'Verificar que no haya software antivirus bloqueando la ejecución',
                    'Revisar los registros de eventos de Windows para mensajes de error específicos'
                ]
            },
            'virus': {
                title: '🦠 Posible infección de virus',
                steps: [
                    'No entrar en pánico - desconectar internet temporalmente si es necesario',
                    'Ejecutar análisis completo con tu software antivirus actualizado',
                    'Usar Windows Defender o instalar Malwarebytes para segunda opinión',
                    'Iniciar en modo seguro si el sistema está muy comprometido',
                    'Cambiar todas las contraseñas importantes desde otro dispositivo',
                    'Verificar procesos sospechosos en el Administrador de tareas',
                    'Eliminar archivos temporales y limpiar navegadores',
                    'Restaurar sistema a punto anterior si el problema persiste',
                    'Considerar formateo completo si la infección es severa'
                ]
            },
            'actualizaciones': {
                title: '🔄 Problemas con actualizaciones',
                steps: [
                    'Verificar conexión a internet estable antes de intentar actualizar',
                    'Liberar espacio en disco - las actualizaciones requieren espacio temporal',
                    'Ejecutar el solucionador de problemas de Windows Update',
                    'Reiniciar el servicio de Windows Update desde servicios.msc',
                    'Limpiar la carpeta de distribución de software: C:\\Windows\\SoftwareDistribution',
                    'Intentar actualizar en modo seguro si las actualizaciones fallan repetidamente',
                    'Descargar actualizaciones manualmente desde el catálogo de Microsoft',
                    'Verificar que la fecha y hora del sistema sean correctas',
                    'Si nada funciona, considerar actualización limpia de Windows'
                ]
            },
            'sin-internet': {
                title: '🌐 Sin conexión a Internet',
                steps: [
                    'Verificar que otros dispositivos se conecten al mismo router',
                    'Reiniciar el router desconectándolo por 30 segundos',
                    'Verificar que los cables de red estén bien conectados',
                    'Ejecutar el solucionador de problemas de red de Windows',
                    'Restablecer configuración de red: netsh winsock reset en CMD',
                    'Actualizar controladores de la tarjeta de red',
                    'Verificar configuración de DNS - probar con 8.8.8.8 y 8.8.4.4',
                    'Deshabilitar temporalmente firewall y antivirus para probar',
                    'Contactar proveedor de internet si el problema persiste'
                ]
            },
            'wifi-lento': {
                title: '📶 WiFi lento o intermitente',
                steps: [
                    'Acercarse al router para verificar si mejora la señal',
                    'Verificar cuántos dispositivos están conectados a la red',
                    'Cambiar canal WiFi en configuración del router (usar 1, 6 u 11 para 2.4GHz)',
                    'Actualizar controladores de la tarjeta WiFi',
                    'Olvidar y reconectar a la red WiFi',
                    'Verificar si hay interferencias de otros dispositivos electrónicos',
                    'Probar conexión en banda de 5GHz si está disponible',
                    'Reiniciar adaptador de red desde Administrador de dispositivos',
                    'Considerar extender cobertura WiFi si la distancia es el problema'
                ]
            },
            'bluetooth': {
                title: '📱 Problemas con Bluetooth',
                steps: [
                    'Verificar que Bluetooth esté habilitado en configuración de Windows',
                    'Asegurar que el dispositivo a conectar esté en modo de emparejamiento',
                    'Eliminar dispositivo de la lista y volver a emparejarlo',
                    'Actualizar controladores Bluetooth desde Administrador de dispositivos',
                    'Reiniciar el servicio de Bluetooth en servicios.msc',
                    'Verificar que no haya interferencia de dispositivos de 2.4GHz cercanos',
                    'Probar con otro dispositivo Bluetooth para descartar problemas de hardware',
                    'Ejecutar solucionador de problemas de Bluetooth de Windows',
                    'Si persiste, puede ser problema de hardware - contactar soporte técnico'
                ]
            },
            'teclado-mouse': {
                title: '⌨️ Teclado o mouse no funcionan',
                steps: [
                    'Verificar conexiones físicas - reconectar cables USB',
                    'Probar en otros puertos USB para descartar puerto defectuoso',
                    'Si son inalámbricos, verificar carga de pilas o batería',
                    'Reiniciar el equipo para recargar controladores',
                    'Verificar en Administrador de dispositivos si aparecen con errores',
                    'Probar con otro teclado/mouse para identificar si es problema de hardware',
                    'Desinstalar y reinstalar controladores del dispositivo',
                    'Verificar configuración de energía USB - deshabilitar suspensión selectiva',
                    'Si es problema de hardware, considerar reemplazo del dispositivo'
                ]
            },
            'impresora': {
                title: '🖨️ Problemas con impresora',
                steps: [
                    'Verificar que la impresora esté encendida y conectada correctamente',
                    'Comprobar niveles de tinta o tóner',
                    'Verificar que no haya atascos de papel en la bandeja',
                    'Reinstalar controladores de la impresora',
                    'Configurar como impresora predeterminada en Windows',
                    'Ejecutar solucionador de problemas de impresora de Windows',
                    'Limpiar cabezales de impresión desde software de la impresora',
                    'Verificar cola de impresión y cancelar trabajos pendientes',
                    'Probar imprimir página de prueba desde propiedades de impresora'
                ]
            },
            'audio': {
                title: '🔊 Sin audio o problemas de sonido',
                steps: [
                    'Verificar que el volumen no esté silenciado o muy bajo',
                    'Comprobar conexiones de altavoces o auriculares',
                    'Actualizar controladores de audio desde Administrador de dispositivos',
                    'Verificar que el dispositivo de audio correcto esté seleccionado',
                    'Ejecutar solucionador de problemas de audio de Windows',
                    'Reiniciar servicio de audio de Windows',
                    'Probar con diferentes auriculares o altavoces',
                    'Verificar configuración de audio en aplicaciones específicas',
                    'Restaurar controladores de audio si el problema comenzó recientemente'
                ]
            }
        };

        // Base de conocimientos mejorada para el asistente
        const knowledgeBase = {
            // Patrones de problemas comunes
            patterns: {
                'lento|rendimiento|velocidad|demora': 'performance',
                'no enciende|no prende|no arranca|dead': 'power',
                'internet|wifi|red|conexión|conectividad': 'network',
                'virus|malware|infectado|sospechoso': 'security',
                'pantalla azul|bsod|error azul': 'bsod',
                'caliente|temperatura|ventilador|sobrecalentamiento': 'overheating',
                'ruido|sonido extraño|clicks|chirridos': 'hardware_noise',
                'actualización|update|windows update': 'updates',
                'programas|aplicaciones|software no abre': 'software_issues',
                'teclado|mouse|ratón|periférico': 'peripherals',
                'audio|sonido|altavoces|auriculares': 'audio',
                'impresora|imprimir|print': 'printer',
                'bluetooth|emparejamiento': 'bluetooth'
            },

            // Respuestas contextuales avanzadas
            responses: {
                performance: {
                    analysis: "Veo que tienes problemas de rendimiento. Voy a ayudarte a diagnosticar y optimizar tu sistema.",
                    questions: [
                        "¿Cuándo comenzó a ir lento tu computador?",
                        "¿Ocurre siempre o solo con programas específicos?",
                        "¿Has instalado software nuevo recientemente?"
                    ],
                    solutions: [
                        "🔍 **Diagnóstico inmediato**: Abre el Administrador de tareas (Ctrl+Shift+Esc) y revisa qué procesos están consumiendo más CPU y memoria.",
                        "🧹 **Limpieza rápida**: Ejecuta Liberador de espacio en disco y elimina archivos temporales.",
                        "⚡ **Optimización de inicio**: Desactiva programas innecesarios que se ejecutan al iniciar Windows.",
                        "🔄 **Mantenimiento**: Ejecuta `sfc /scannow` en CMD como administrador para reparar archivos del sistema."
                    ]
                },
                power: {
                    analysis: "Problema crítico de alimentación. Te guío paso a paso para diagnosticar si es hardware o configuración.",
                    questions: [
                        "¿Hay alguna luz o LED encendido en el equipo?",
                        "¿Es un computador de escritorio o portátil?",
                        "¿Ocurrió después de algún evento específico?"
                    ],
                    solutions: [
                        "🔌 **Verificación básica**: Asegúrate de que todos los cables estén firmemente conectados.",
                        "⚡ **Test de alimentación**: Prueba con otro tomacorriente conocido que funcione.",
                        "🔋 **Para portátiles**: Intenta sin batería, solo con cargador conectado.",
                        "⏰ **Reset CMOS**: Si nada funciona, puede necesitar reset de BIOS."
                    ]
                },
                network: {
                    analysis: "Problemas de conectividad pueden tener varias causas. Vamos a identificar si es tu equipo, router o ISP.",
                    questions: [
                        "¿Otros dispositivos se conectan bien a la misma red?",
                        "¿Es problema de WiFi o también cable de red?",
                        "¿Cuándo funcionó por última vez?"
                    ],
                    solutions: [
                        "🌐 **Test básico**: Ejecuta `ping google.com` en CMD para verificar conectividad.",
                        "🔄 **Reset de red**: `netsh winsock reset` y `ipconfig /flushdns` en CMD como administrador.",
                        "📡 **Diagnóstico WiFi**: Olvida la red y reconéctate, o prueba conectarte a tu hotspot móvil.",
                        "🛠️ **Drivers**: Actualiza controladores de red desde Administrador de dispositivos."
                    ]
                },
                security: {
                    analysis: "Posible compromiso de seguridad. Actuemos rápido pero sin pánico para limpiar el sistema.",
                    questions: [
                        "¿Qué comportamientos extraños has notado?",
                        "¿Has descargado algo sospechoso recientemente?",
                        "¿Tu antivirus está actualizado y funcionando?"
                    ],
                    solutions: [
                        "🛡️ **Análisis inmediato**: Ejecuta análisis completo con Windows Defender o tu antivirus.",
                        "🔍 **Segunda opinión**: Descarga y ejecuta Malwarebytes Anti-Malware.",
                        "🔒 **Modo seguro**: Reinicia en modo seguro si el sistema está muy comprometido.",
                        "🔑 **Cambio de contraseñas**: Cambia contraseñas importantes desde otro dispositivo limpio."
                    ]
                },
                bsod: {
                    analysis: "La pantalla azul indica un error crítico del sistema. El código específico nos dará pistas importantes.",
                    questions: [
                        "¿Pudiste anotar el código de error (ej: 0x0000007B)?",
                        "¿Ocurre en situaciones específicas o aleatoriamente?",
                        "¿Instalaste hardware o software nuevo recientemente?"
                    ],
                    solutions: [
                        "📝 **Código de error**: Anota el código STOP específico para diagnóstico preciso.",
                        "🔧 **Modo seguro**: Inicia en modo seguro presionando F8 durante el arranque.",
                        "🔄 **Última configuración**: Usa 'Última configuración buena conocida' en opciones avanzadas.",
                        "💾 **Verificación RAM**: Ejecuta diagnóstico de memoria de Windows."
                    ]
                }
            }
        };

        // Sistema de respuestas inteligentes mejorado
        class TechAssistant {
            constructor() {
                this.context = '';
                this.userPreferences = {};
                this.conversationHistory = [];
            }

            analyzeMessage(message) {
                const lowerMessage = message.toLowerCase();
                
                // Detectar patrones en el mensaje
                for (const [pattern, category] of Object.entries(knowledgeBase.patterns)) {
                    const regex = new RegExp(pattern, 'i');
                    if (regex.test(lowerMessage)) {
                        return category;
                    }
                }
                
                return 'general';
            }

            generateResponse(message, category) {
                const responses = knowledgeBase.responses[category];
                
                if (responses) {
                    let response = responses.analysis + "\n\n";
                    
                    // Agregar preguntas de diagnóstico
                    if (responses.questions) {
                        response += "**Preguntas de diagnóstico:**\n";
                        responses.questions.forEach((q, i) => {
                            response += `${i + 1}. ${q}\n`;
                        });
                        response += "\n";
                    }
                    
                    // Agregar soluciones paso a paso
                    if (responses.solutions) {
                        response += "**Soluciones paso a paso:**\n\n";
                        responses.solutions.forEach(solution => {
                            response += `${solution}\n\n`;
                        });
                    }
                    
                    // Agregar seguimiento
                    response += "💬 **¿Necesitas ayuda con alguno de estos pasos específicos?** Solo dime cuál y te guío en detalle.";
                    
                    return response;
                }
                
                return this.getGeneralResponse(message);
            }

            getGeneralResponse(message) {
                const lowerMessage = message.toLowerCase();
                
                // Respuestas generales mejoradas
                if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
                    return "¡Hola! 👋 Soy tu asistente técnico especializado. Estoy aquí para ayudarte a resolver cualquier problema con tu computador. ¿Qué dificultad técnica estás experimentando?";
                }
                
                if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
                    return "¡De nada! 😊 Me alegra poder ayudarte. Si tienes más problemas técnicos o preguntas sobre el proceso, no dudes en consultarme. ¿Hay algo más en lo que pueda asistirte?";
                }
                
                if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
                    return `Claro, puedo ayudarte con una amplia gama de problemas técnicos:

🔧 **Hardware**: Problemas de encendido, sobrecalentamiento, ruidos extraños
💻 **Software**: Rendimiento lento, aplicaciones que no responden, errores del sistema  
🌐 **Conectividad**: Internet, WiFi, Bluetooth, red
🛡️ **Seguridad**: Virus, malware, actualizaciones de seguridad
🖱️ **Periféricos**: Teclado, mouse, impresora, audio

Solo describe tu problema con el mayor detalle posible y te proporcionaré una solución paso a paso. ¿Qué problema específico estás experimentando?`;
                }
                
                // Respuesta por defecto mejorada
                return `Entiendo que tienes una consulta técnica. Para poder ayudarte de la mejor manera, me gustaría conocer más detalles:

🔍 **¿Puedes describir específicamente qué está ocurriendo?**
📅 **¿Cuándo comenzó el problema?**
💻 **¿Qué tipo de equipo tienes? (Windows, Mac, marca/modelo)**
⚠️ **¿Aparece algún mensaje de error específico?**

Mientras tanto, puedes revisar las **categorías de problemas** en el panel izquierdo o usar las **acciones rápidas** aquí abajo para obtener ayuda inmediata sobre temas comunes.

¡Estoy aquí para resolver tu problema técnico paso a paso! 🚀`;
            }
        }

        // Instancia del asistente
        const assistant = new TechAssistant();

        // Funciones principales mejoradas
        function addMessage(message, isUser = false, showActions = false) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
            
            // Procesar markdown básico para respuestas del asistente
            if (!isUser) {
                message = processMarkdown(message);
                messageDiv.innerHTML = message;
            } else {
                messageDiv.textContent = message;
            }
            
            // Agregar timestamp
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = time;
            messageDiv.appendChild(timeDiv);
            
            // Agregar acciones para mensajes del asistente
            if (!isUser && showActions) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';
                actionsDiv.innerHTML = `
                    <button class="action-btn" onclick="rateMessage(this, 'good')">👍</button>
                    <button class="action-btn" onclick="rateMessage(this, 'bad')">👎</button>
                    <button class="action-btn" onclick="copyMessage(this)">📋</button>
                `;
                messageDiv.appendChild(actionsDiv);
            }
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function processMarkdown(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        }

        function showTypingIndicator() {
            const chatContainer = document.getElementById('chatContainer');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-animation';
            typingDiv.id = 'typing';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatContainer.appendChild(typingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // Actualizar estado
            document.getElementById('assistantStatus').style.display = 'none';
            document.getElementById('typingIndicator').style.display = 'block';
        }

        function hideTypingIndicator() {
            const typing = document.getElementById('typing');
            if (typing) {
                typing.remove();
            }
            
            // Restaurar estado
            document.getElementById('assistantStatus').style.display = 'block';
            document.getElementById('typingIndicator').style.display = 'none';
        }

        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            const sendBtn = document.getElementById('sendBtn');
            
            if (!message || isTyping) return;
            
            // Agregar mensaje del usuario
            addMessage(message, true);
            input.value = '';
            
            // Deshabilitar input mientras procesa
            input.disabled = true;
            sendBtn.disabled = true;
            isTyping = true;
            
            // Mostrar indicador de escritura
            showTypingIndicator();
            
            // Simular tiempo de procesamiento realista
            setTimeout(() => {
                hideTypingIndicator();
                
                // Analizar mensaje y generar respuesta
                const category = assistant.analyzeMessage(message);
                const response = assistant.generateResponse(message, category);
                
                // Agregar respuesta del asistente
                addMessage(response, false, true);
                
                // Restaurar input
                input.disabled = false;
                sendBtn.disabled = false;
                isTyping = false;
                input.focus();
                
            }, 1500 + Math.random() * 1000); // Tiempo variable para simular procesamiento
        }

        function sendSuggestion(suggestion) {
            document.getElementById('userInput').value = suggestion;
            sendMessage();
        }

        function quickAction(action) {
            const responses = {
                'diagnostico': `🔍 **Diagnóstico Automático del Sistema**

Vamos a revisar el estado general de tu computador. Sigue estos pasos:

**1. Verificación de Recursos:**
• Abre Administrador de tareas (Ctrl+Shift+Esc)
• Revisa uso de CPU, Memoria y Disco
• Identifica procesos que consuman muchos recursos

**2. Estado del Sistema:**
• Presiona Win+R, escribe "msinfo32"
• Revisa información general del sistema
• Anota cualquier advertencia o error

**3. Salud del Disco:**
• Abre CMD como administrador
• Ejecuta: \`chkdsk C: /f /r\` (programa para próximo reinicio)
• Para SSD, usa: \`sfc /scannow\`

**4. Temperatura y Hardware:**
• Verifica que ventiladores funcionen
• Escucha ruidos extraños
• Siente si hay sobrecalentamiento

**📊 ¿Qué encontraste en estos diagnósticos?** Comparte los resultados y te ayudaré a interpretarlos.`,

                'mantenimiento': `🧹 **Guía de Mantenimiento Preventivo**

**Mantenimiento Semanal:**
• Reinicia el equipo completamente al menos una vez
• Ejecuta análisis antivirus completo
• Limpia archivos temporales con Liberador de espacio

**Mantenimiento Mensual:**
• Actualiza controladores importantes
• Verifica y instala actualizaciones de Windows
• Limpia físicamente teclado y pantalla
• Revisa programas instalados y desinstala los innecesarios

**Mantenimiento Trimestral:**
• Limpieza física interna con aire comprimido
• Desfragmentación de disco (solo HDD)
• Backup completo de archivos importantes
• Verificación de temperatura del sistema

**Mantenimiento Anual:**
• Reemplazo de pasta térmica (si es necesario)
• Verificación completa de hardware
• Formateo y reinstalación limpia (opcional)

**💡 ¿Te gustaría que te guíe en alguno de estos procesos específicos?**`,

                'optimizacion': `⚡ **Optimización Avanzada del Rendimiento**

**Optimización Inmediata:**
• Deshabilita efectos visuales: Panel de Control > Sistema > Configuración avanzada > Rendimiento
• Configura servicios: \`services.msc\` - deshabilita servicios innecesarios
• Limpia registro con herramientas confiables

**Gestión de Memoria:**
• Cierra programas que no uses activamente
• Ajusta memoria virtual: 1.5x tu RAM física
• Considera actualizar RAM si usas constantemente >80%

**Optimización de Almacenamiento:**
• Mantén 15-20% de espacio libre siempre
• Usa SSD como disco principal si es posible
• Configura ubicaciones de archivos temporales

**Configuración de Energía:**
• Usa plan "Alto rendimiento" cuando sea necesario
• Ajusta configuración de suspensión de USB
• Verifica que la CPU no esté limitada por temperatura

**🚀 ¿En qué área específica quieres enfocarte primero?**`,

                'seguridad': `🛡️ **Verificación Completa de Seguridad**

**Protección Antimalware:**
• Verifica que Windows Defender esté activo y actualizado
• Ejecuta análisis completo del sistema
• Instala Malwarebytes para segunda opinión

**Configuración de Firewall:**
• Verifica que Firewall de Windows esté habilitado
• Revisa aplicaciones permitidas
• Configura reglas para programas específicos

**Actualizaciones de Seguridad:**
• Instala todas las actualizaciones pendientes de Windows
• Actualiza navegadores y plugins (Java, Flash, etc.)
• Mantén software importante siempre actualizado

**Configuración de Navegadores:**
• Habilita navegación segura
• Configura bloqueador de pop-ups
• Revisa extensiones instaladas y elimina las sospechosas

**Mejores Prácticas:**
• Usa contraseñas únicas y seguras
• Habilita autenticación de dos factores donde sea posible
• No descargues software de sitios no confiables
• Mantén backups regulares de datos importantes

**🔒 ¿Has detectado alguna actividad sospechosa específica?**`
            };

            const response = responses[action];
            if (response) {
                // Simular que el usuario hizo la pregunta
                const actionTitles = {
                    'diagnostico': 'Ejecutar diagnóstico automático',
                    'mantenimiento': 'Guía de mantenimiento preventivo', 
                    'optimizacion': 'Optimizar rendimiento del sistema',
                    'seguridad': 'Verificar seguridad del equipo'
                };
                
                addMessage(actionTitles[action], true);
                
                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        hideTypingIndicator();
                        addMessage(response, false, true);
                    }, 1200);
                }, 500);
            }
        }

        function rateMessage(btn, rating) {
            const message = btn.closest('.message');
            message.style.opacity = '0.7';
            
            if (rating === 'good') {
                btn.innerHTML = '👍 ¡Útil!';
                btn.style.color = '#27ae60';
            } else {
                btn.innerHTML = '👎 Enviado';
                btn.style.color = '#e74c3c';
            }
            
            btn.disabled = true;
            
            // Simular envío de feedback
            setTimeout(() => {
                const feedback = document.createElement('div');
                feedback.style.cssText = 'font-size: 12px; color: #7f8c8d; margin-top: 5px;';
                feedback.textContent = rating === 'good' ? 
                    'Gracias por tu feedback positivo 😊' : 
                    'Gracias por tu feedback. Trabajaremos para mejorar 🔧';
                message.appendChild(feedback);
            }, 500);
        }

        function copyMessage(btn) {
            const message = btn.closest('.message');
            const text = message.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                btn.innerHTML = '✅ Copiado';
                btn.style.color = '#27ae60';
                setTimeout(() => {
                    btn.innerHTML = '📋';
                    btn.style.color = '#7f8c8d';
                }, 2000);
            });
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        // Funciones del sistema de categorías (mantenidas del original)
        function toggleCategory(categoryId) {
            const content = document.getElementById(categoryId);
            const header = content.previousElementSibling;
            const arrow = header.querySelector('span:last-child');
            
            // Cerrar otras categorías
            document.querySelectorAll('.category-content').forEach(cat => {
                if (cat.id !== categoryId) {
                    cat.classList.remove('active');
                    cat.previousElementSibling.querySelector('span:last-child').innerHTML = '▼';
                }
            });
            
            // Toggle categoría actual
            content.classList.toggle('active');
            arrow.innerHTML = content.classList.contains('active') ? '▲' : '▼';
        }

        function showSolution(problemId) {
            const solution = solutions[problemId];
            if (!solution) return;
            
            const modal = document.getElementById('solutionModal');
            const details = document.getElementById('solutionDetails');
            
            let stepsHtml = '<ul class="solution-steps">';
            solution.steps.forEach(step => {
                stepsHtml += `<li>${step}</li>`;
            });
            stepsHtml += '</ul>';
            
            details.innerHTML = `
                <h2>${solution.title}</h2>
                <p style="margin-bottom: 20px; color: #7f8c8d;">Sigue estos pasos en orden para resolver el problema:</p>
                ${stepsHtml}
                <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px; border-left: 4px solid #27ae60;">
                    <strong>💡 Consejo:</strong> Si después de seguir todos los pasos el problema persiste, no dudes en contactar a nuestro asistente virtual o un técnico especializado.
                </div>
            `;
            
            modal.style.display = 'flex';
        }

        function closeSolution() {
            document.getElementById('solutionModal').style.display = 'none';
        }

        // Event listeners y configuración inicial
        document.addEventListener('DOMContentLoaded', function() {
            // Focus automático en el input
            document.getElementById('userInput').focus();
            
            // Cerrar modal al hacer click fuera
            document.getElementById('solutionModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeSolution();
                }
            });
            
            // Mejorar experiencia de chat con auto-resize del input
            const input = document.getElementById('userInput');
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
            
            // Mensajes de bienvenida adicionales
            setTimeout(() => {
                addMessage('💡 **Tip**: Puedes hacer clic en cualquier problema de las categorías para ver soluciones detalladas, o simplemente describir tu problema aquí y te ayudaré paso a paso.', false, false);
            }, 3000);
            
            setTimeout(() => {
                addMessage('🚀 **¿Sabías que?** Puedo ayudarte con diagnósticos en tiempo real, análisis de rendimiento, y resolver problemas complejos. ¡No dudes en ser específico sobre tu problema!', false, false);
            }, 8000);
        });

        // Funciones de utilidad adicionales
        function clearChat() {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = `
                <div class="message assistant">
                    ¡Hola! 👋 Soy TechFix Assistant, tu asistente técnico especializado. Puedo ayudarte con:
                    
                    • Diagnóstico de problemas de hardware y software
                    • Solución paso a paso de errores comunes
                    • Optimización del rendimiento de tu equipo
                    • Consejos de seguridad y mantenimiento
                    
                    ¿Qué problema técnico puedo ayudarte a resolver hoy?
                    <div class="suggestions">
                        <span class="suggestion-chip" onclick="sendSuggestion('Mi computador está muy lento')">Mi PC está lento</span>
                        <span class="suggestion-chip" onclick="sendSuggestion('No tengo internet')">Problemas de internet</span>
                        <span class="suggestion-chip" onclick="sendSuggestion('Mi computador no enciende')">No enciende</span>
                    </div>
                    <div class="message-actions">
                        <button class="action-btn" onclick="rateMessage(this, 'good')">👍</button>
                        <button class="action-btn" onclick="rateMessage(this, 'bad')">👎</button>
                        <button class="action-btn" onclick="copyMessage(this)">📋</button>
                    </div>
                </div>
            `;
            conversationHistory = [];
        }

        // Función para exportar conversación
        function exportChat() {
            const messages = document.querySelectorAll('.message');
            let chatText = 'Conversación con TechFix Assistant\n';
            chatText += '=' + '='.repeat(40) + '\n\n';
            
            messages.forEach(msg => {
                const isUser = msg.classList.contains('user');
                const sender = isUser ? 'Usuario' : 'TechFix Assistant';
                const content = msg.textContent.replace(/👍.*|👎.*|📋.*|Gracias por.*/, '').trim();
                chatText += `${sender}:\n${content}\n\n`;
            });
            
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `techfix_chat_${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }

        // Función para detectar problemas automáticamente
        function autoDetectIssues() {
            // Simulación de detección automática de problemas comunes
            const commonIssues = [
                {
                    issue: 'Uso alto de CPU detectado',
                    suggestion: '¿Tu computador está funcionando lentamente? Puedo ayudarte a identificar qué procesos están consumiendo recursos.'
                },
                {
                    issue: 'Espacio en disco bajo',
                    suggestion: '¿Has notado que tu computador va más lento? Podrías necesitar liberar espacio en disco.'
                },
                {
                    issue: 'Actualizaciones pendientes',
                    suggestion: '¿Cuándo fue la última vez que actualizaste tu sistema? Las actualizaciones mejoran seguridad y rendimiento.'
                }
            ];
            
            // Esta función se podría llamar periódicamente o en respuesta a eventos específicos
            return commonIssues[Math.floor(Math.random() * commonIssues.length)];
        }

        // Sistema de sugerencias inteligentes
        function getSmartSuggestions(message) {
            const lowerMessage = message.toLowerCase();
            const suggestions = [];
            
            if (lowerMessage.includes('lento')) {
                suggestions.push('¿Cuánta RAM tienes?', '¿Qué programas tienes abiertos?', '¿Cuándo empezó la lentitud?');
            } else if (lowerMessage.includes('internet')) {
                suggestions.push('¿Otros dispositivos funcionan?', '¿Es WiFi o cable?', '¿Qué velocidad contratas?');
            } else if (lowerMessage.includes('no enciende')) {
                suggestions.push('¿Hay luces encendidas?', '¿Es portátil o escritorio?', '¿Probaste otro enchufe?');
            }
            
            return suggestions;
        }

        // Mejorar accessibility
        function improveAccessibility() {
            // Agregar navegación por teclado
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === '/') {
                    document.getElementById('userInput').focus();
                }
                if (e.key === 'Escape') {
                    closeSolution();
                }
            });
            
            // Agregar roles ARIA
            document.getElementById('chatContainer').setAttribute('role', 'log');
            document.getElementById('chatContainer').setAttribute('aria-live', 'polite');
            document.getElementById('userInput').setAttribute('aria-label', 'Escribe tu consulta técnica');
        }

        // Inicializar mejoras de accesibilidad
        improveAccessibility();

        // Sistema de notificaciones para problemas críticos
        function showCriticalAlert(message) {
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 1001;
                background: linear-gradient(45deg, #e74c3c, #c0392b);
                color: white; padding: 15px 20px; border-radius: 10px;
                box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
                animation: slideInRight 0.3s ease;
            `;
            alertDiv.innerHTML = `
                <strong>⚠️ Alerta Crítica</strong><br>
                ${message}
                <button onclick="this.parentElement.remove()" style="
                    background: none; border: none; color: white; 
                    float: right; margin-left: 10px; cursor: pointer;">✕</button>
            `;
            document.body.appendChild(alertDiv);
            
            setTimeout(() => alertDiv.remove(), 10000);
        }

        // Función para manejar errores de JavaScript
        window.addEventListener('error', function(e) {
            console.error('Error en TechFix Assistant:', e.error);
            // Opcionalmente mostrar mensaje de error al usuario
            addMessage('⚠️ Ocurrió un error técnico. Por favor, recarga la página si el problema persiste.', false, false);
        });

        console.log('🚀 TechFix Assistant cargado exitosamente');