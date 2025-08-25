import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // Terminal state variables
  const [terminalHistory, setTerminalHistory] = useState([]); // Stores all terminal lines (input/output)
  const [currentInput, setCurrentInput] = useState(""); // Current user input
  const [isTyping, setIsTyping] = useState(true); // Typing lock during boot
  const [showCursor, setShowCursor] = useState(true); // Blinking cursor
  const [show404, setShow404] = useState(false);
  const [secretProgress, setSecretProgress] = useState(0); // Tracks secret challenge progress
  const [konami, setKonami] = useState([]); // Tracks Konami code sequence
  const [loginAttempts, setLoginAttempts] = useState(0); // Failed login attempts
  const [showGammaHint, setShowGammaHint] = useState(false); // Hover state for 31337
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Root access
  const [hiddenCommands, setHiddenCommands] = useState(new Set()); // Unlocked commands

  // Refs for input focus and terminal scroll
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Konami code sequence for easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  // All supported terminal commands
  const commands = {
    help: () =>
      [
        "AVAILABLE COMMANDS:",
        "═══════════════════════════════════════════════════════════",
        "help     - Show this help menu",
        "about    - Display system information",
        "clear    - Clear terminal screen",
        "whoami   - Display current user identity",
        "ls       - List directory contents",
        "cat      - Read file contents",
        "echo     - Display text",
        "date     - Show current date/time",
        "ps       - Show running processes",
        "netstat  - Display network connections",
        "finger   - User information lookup",
        "exit     - Terminate session",
        "═══════════════════════════════════════════════════════════",
        "NOTE: Some commands require special privileges...",
        hiddenCommands.has("sudo") ? "sudo     - Execute as superuser" : "",
        hiddenCommands.has("telnet")
          ? "telnet   - Remote connection protocol"
          : "",
        hiddenCommands.has("ftp") ? "ftp      - File transfer protocol" : "",
        hiddenCommands.has("debug") ? "debug    - System debugging tools" : "",
      ].filter(Boolean),

    about: () => [
      "RETRO_CYBER_TERMINAL v1.337.90",
      "═══════════════════════════════════════════════════════════",
      "System:     MS-DOS Compatible CyberOS",
      "Version:    3.11 for Workgroups [ENHANCED]",
      "CPU:        Intel 80486DX2-66 MHz",
      "RAM:        4 MB Extended Memory",
      "Graphics:   VGA 256 Colors",
      "Sound:      SoundBlaster Pro Compatible",
      "Network:    Ethernet NE2000 Compatible",
      "═══════════════════════════════════════════════════════════",
      "Copyright (C) 1990-1995 CyberCorp Industries",
      "All rights reserved. Unauthorized access prohibited.",
    ],

    whoami: () => [
      isAuthenticated ? "USER: admin@retro_cyber" : "USER: guest@retro_cyber",
      `PRIVILEGE LEVEL: ${isAuthenticated ? "[ROOT ACCESS]" : "[LIMITED]"}`,
      "SESSION: DIAL-UP_CONNECTION_9600_BAUD",
      "",
      "Connected via: 555-CYBER (Local BBS)",
      isAuthenticated ? "Status: AUTHENTICATED" : "Status: GUEST ACCESS",
      "",
      !isAuthenticated ? "Hint: Try 'finger root' for user information..." : "",
    ],

    finger: (args) => {
      // User info lookup with clues for the secret challenge
      const user = args[0];
      if (user === "root") {
        return [
          "FINGER: root@retro_cyber",
          "═══════════════════════════════════════════════════════════",
          "Login: root",
          "Directory: /root",
          "Shell: /bin/bash",
          "Last login: Never logged in",
          "",
          "Plan:",
          "The system administrator account is protected.",
          "Password hint: What do hackers drink at 3AM?",
          "Format: all lowercase, no spaces",
          "",
          "To authenticate, use the command: login <password>",
        ];
      } else if (user === "sysop") {
        if (secretProgress >= 1) {
          return [
            "FINGER: sysop@retro_cyber",
            "═══════════════════════════════════════════════════════════",
            "Login: sysop",
            "Directory: /home/sysop",
            "Shell: /bin/sh",
            "Last login: Dec 25 23:59 from localhost",
            "",
            "Plan:",
            "BBS System Operator since 1990",
            "Maintains the RETRO_CYBER network",
            "Hidden files location: ~/.config/secrets/",
            "",
            "FRAGMENT_ALPHA discovered in user profile!",
            "Clue: It's the kind of color that glows brightest in the dark,",
            "      and defined the look of every cyberpunk cityscape.",
            "Next clue requires network investigation...",
          ];
        } else {
          return ["finger: sysop: User not found or access denied"];
        }
      } else {
        return [`finger: ${user || "unknown"}: No such user`];
      }
    },

    su: (args) => {
      // Simulate 'su' command for root
      const user = args[0];
      if (user === "root") {
        return [
          "Password: ",
          "Authentication required for root access",
          "Enter the password when prompted...",
          "",
          "Hint: What do hackers drink at 3AM?",
        ];
      }
      return ["su: invalid user"];
    },

    login: (args) => {
      // Login command for authentication
      const password = args.join(" ").toLowerCase();
      if (
        password === "coffee" ||
        password === "jolt" ||
        password === "caffeine"
      ) {
        setIsAuthenticated(true);
        setHiddenCommands(
          (prev) => new Set([...prev, "sudo", "debug", "telnet"])
        );
        setSecretProgress(Math.max(secretProgress, 1));
        return [
          "ACCESS GRANTED",
          "═══════════════════════════════════════════════════════════",
          "Welcome, Administrator",
          "Root privileges activated",
          "",
          "New commands available:",
          "- sudo (superuser operations)",
          "- debug (system diagnostics)",
          "- telnet (remote connections)",
          "",
          "Check 'netstat' for active connections...",
        ];
      } else {
        setLoginAttempts((prev) => prev + 1);
        if (loginAttempts >= 2) {
          return [
            "SECURITY VIOLATION DETECTED",
            "═══════════════════════════════════════════════════════════",
            "Multiple failed login attempts",
            "Activating lockdown protocol...",
            "",
            "System hint activated:",
            "Try the 'konami' sequence for emergency access",
            "Or investigate network connections for backdoors...",
          ];
        }
        return [
          "Access denied. Invalid password.",
          `Attempts remaining: ${3 - loginAttempts - 1}`,
        ];
      }
    },

    netstat: () => {
      // Show network connections (with secret clue)
      if (!isAuthenticated) {
        return ["netstat: Permission denied. Root access required."];
      }
      return [
        "Active Network Connections:",
        "═══════════════════════════════════════════════════════════",
        "Proto Local Address    Foreign Address    State",
        "TCP   127.0.0.1:1337   0.0.0.0:0         LISTENING",
        "TCP   127.0.0.1:31337  RETRO.BBS:23      ESTABLISHED",
        "TCP   127.0.0.1:8080   HIDDEN.SRV:80     TIME_WAIT",
        "UDP   192.168.1.90:53  DNS.CYBER:53      CONNECTED",
        "",
        "Suspicious connection detected on port 31337",
        "Use 'telnet 127.0.0.1 31337' to investigate...",
      ];
    },

    telnet: (args) => {
      // Simulate telnet command for BBS connection
      if (!isAuthenticated) {
        return ["telnet: Permission denied. Root access required."];
      }

      const host = args[0];
      const port = args[1];

      if (host === "127.0.0.1" && port === "31337") {
        setSecretProgress(Math.max(secretProgress, 2));
        return [
          "Connecting to 127.0.0.1:31337...",
          "Connected to RETRO.BBS",
          "",
          "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
          "█ WELCOME TO THE RETRO CYBER BBS NETWORK █",
          "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
          "",
          "Message from SysOp:",
          "The final piece lies in the forgotten archives.",
          "Only those who know the ancient ways can access it.",
          "",
          "FRAGMENT_BETA: The second key is 'MATRIX'",
          "",
          "Final hint: Inspect the very foundation of this realm.",
          "Where the web's skeleton is built... <source>",
          "",
          "Connection terminated by foreign host.",
        ];
      }
      return ["telnet: connection failed"];
    },

    debug: (args) => {
      // Debugging tools for memory and trace
      if (!isAuthenticated) {
        return ["debug: Permission denied. Root access required."];
      }

      if (args[0] === "memory") {
        return [
          "MEMORY DEBUG DUMP:",
          "═══════════════════════════════════════════════════════════",
          "0x1000: 4E 45 4F 4E 00 00 00 00  NEON....",
          "0x1008: 4D 41 54 52 49 58 00 00  MATRIX..",
          "0x1010: 43 59 42 45 52 00 00 00  CYBER...",
          "0x1018: 31 33 33 37 00 00 00 00  1337....",
          "",
          "Memory fragments detected in heap",
          "Possible data corruption or hidden payload",
        ];
      } else if (args[0] === "trace") {
        return [
          "SYSTEM CALL TRACE:",
          "═══════════════════════════════════════════════════════════",
          "open('/dev/hidden/vault', O_RDONLY) = 3",
          "read(3, 'GAMMA_FRAGMENT_31337', 20) = 20",
          "close(3) = 0",
          "",
          "Hidden vault access detected!",
          "Try: cat /dev/hidden/vault",
        ];
      }
      return [
        "DEBUG TOOLS:",
        "debug memory  - Dump memory contents",
        "debug trace   - System call trace",
      ];
    },

    ls: (args) => {
      // List directory contents
      const path = args[0] || ".";
      if (path === "/dev/hidden" && secretProgress >= 2) {
        return [
          "HIDDEN DIRECTORY CONTENTS:",
          "═══════════════════════════════════════════════════════════",
          "crw-rw-rw-  1 root root   1,  0 Dec 25 23:59 vault",
          "crw-rw-rw-  1 root root   1,  1 Dec 25 23:58 cipher.key",
          "-rw-------  1 sysop sysop  666 Dec 25 23:57 .shadow_key",
          "",
          "Special device files detected",
        ];
      }

      const files = [
        "drwxr-xr-x  2 guest guest  4096 Dec 25 23:59 bin/",
        "drwxr-xr-x  3 guest guest  4096 Dec 25 23:58 etc/",
        "drwxr-xr-x  2 guest guest  4096 Dec 25 23:57 home/",
        "drwxr-xr-x  5 root  root   4096 Dec 25 23:56 dev/",
        "-rw-r--r--  1 guest guest   842 Dec 25 23:58 readme.txt",
        "-rw-r--r--  1 guest guest   404 Dec 25 23:56 motd.txt",
        "-rwx------  1 root  root     0 Dec 25 23:55 .hidden",
      ];
      return [
        "DIRECTORY LISTING:",
        "═══════════════════════════════════════════════════════════",
        ...files,
        "",
        isAuthenticated ? "Note: You have access to /dev/hidden/" : "",
      ];
    },

    cat: (args) => {
      // Read file contents (including secret vault)
      const file = args.join(" ");
      if (file === "/dev/hidden/vault" && secretProgress >= 2) {
        setSecretProgress(3);
        return [
          "VAULT ACCESS GRANTED",
          "═══════════════════════════════════════════════════════════",
          "FRAGMENT_GAMMA: The final piece is '31337'",
          "",
          "All fragments collected:",
          "ALPHA + BETA + GAMMA = NEON + MATRIX + 31337",
          "",
          "Assembly required. Combine wisely...",
          "Final challenge: Enter the complete sequence",
          "Format: FRAGMENT_ALPHA-FRAGMENT_BETA-FRAGMENT_GAMMA",
        ];
      } else if (file === "readme.txt") {
        return [
          "RETRO CYBER WORLD - README",
          "═══════════════════════════════════════════════════════════",
          "Welcome to the nostalgic digital realm of 1995",
          "",
          "This system runs on authentic 90s protocols",
          "Navigation requires old-school knowledge",
          "",
          "Hidden treasures await those who remember",
          "the ancient ways of the early internet...",
        ];
      } else if (file === "motd.txt") {
        return [
          "═══════════════════════════════════════════════════════════",
          "    Welcome to RETRO CYBER BBS - Est. 1990",
          "═══════════════════════════════════════════════════════════",
          "",
          "System Status: [ONLINE] - 1 user connected",
          "Last message posted: 47 minutes ago",
          "Total files: 31,337 in database",
          "",
          "Remember: This is a private system. Unauthorized",
          "access is prosecuted to the full extent of the law.",
          "",
          "Happy hacking! - SysOp",
        ];
      }
      return [`cat: ${file}: No such file or directory`];
    },

    ps: () => [
      // Simulate process list
      "PID  TTY   TIME     CMD",
      "═══════════════════════════════════════════════════════════",
      "  1  con   00:00:01 kernel",
      " 12  con   00:00:00 init",
      " 45  tty1  00:00:03 bash",
      " 67  tty1  00:00:00 cyber_terminal",
      " 89  ?     00:00:00 [hidden_daemon]",
      "123  ?     00:00:05 syslogd",
      "",
      "Suspicious process 'hidden_daemon' detected",
    ],

    date: () => [
      // Show current date/time
      new Date().toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
      "",
      "System uptime: 31337 seconds",
    ],

    echo: (args) => {
      // Echo text, or check for master key sequence
      const text = args.join(" ");
      if (text.toLowerCase() === "neon-matrix-31337") {
        return [
          " MASTER KEY SEQUENCE RECOGNIZED! ",
          "═══════════════════════════════════════════════════════════",
          "CONGRATULATIONS, ELITE HACKER!",
          "",
          "You have successfully navigated the complex layers",
          "of the RETRO CYBER WORLD and discovered the ultimate secret:",
          "",
          " MASTER KEY: NEON-MATRIX-31337 ",
          "",
          "Achievement Unlocked: 'Digital Archaeologist' ",
          "You've proven worthy of the cyber realm's deepest secrets.",
          "",
          "Welcome to the inner sanctum of the digital underground.",
          "The matrix has chosen you... ",
        ];
      }
      return [text];
    },

    clear: () => {
      // Clear terminal screen
      setTerminalHistory([]);
      return [];
    },

    exit: () => [
      // End session
      "TERMINATING BBS CONNECTION...",
      "═══════════════════════════════════════════════════════════",
      "Disconnecting from RETRO CYBER WORLD",
      "Carrier lost...",
      "",
      "NO CARRIER",
      "",
      "Thank you for visiting our BBS!",
      "Remember: The digital underground never forgets... 👾",
    ],
  };

  // Boot sequence lines for initial animation
  const bootSequence = [
    "RETRO CYBER TERMINAL v1.337.90 - POST",
    "Copyright (C) 1990-1995 CyberCorp Industries",
    "",
    "Memory Test: 4096K OK",
    "Keyboard: Detected",
    "Mouse: Not Found",
    "Modem: Hayes Compatible 14.4K",
    "",
    "Loading CYBER.SYS...",
    "Loading HIMEM.SYS...",
    "Loading EMM386.EXE...",
    "",
    "Starting MS-DOS...",
    "",
    "C:\\CYBER>terminal.exe",
    "",
    "Connecting to RETRO-CYBER-BBS...",
    "Dialing 555-CYBER...",
    "CONNECT 9600 V.42bis",
    "",
    "Welcome to the RETRO CYBER WORLD!",
    "Type 'help' for available commands",
    "",
  ];

  // Konami code easter egg handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonami((prev) => {
        const newSequence = [...prev, e.code];
        if (newSequence.length > konamiCode.length) {
          newSequence.shift();
        }

        if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
          setHiddenCommands(
            (prev) => new Set([...prev, "sudo", "debug", "ftp"])
          );
          setIsAuthenticated(true);
          setSecretProgress(Math.max(secretProgress, 1));

          setTerminalHistory((prev) => [
            ...prev,
            {
              type: "output",
              content: [
                "⬆⬆⬇⬇⬅➡⬅➡BA - KONAMI CODE ACTIVATED!",
                "═══════════════════════════════════════════════════════════",
                "CHEAT MODE ENABLED",
                "Emergency backdoor access granted",
                "Hidden commands unlocked",
                "",
                "Achievement: '30 Lives' 🎮",
              ].join("\n"),
              timestamp: Date.now(),
            },
          ]);

          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretProgress]);

  // Boot sequence animation effect
  useEffect(() => {
    setIsTyping(true);
    let lineIndex = 0;
    const bootTimer = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: bootSequence[lineIndex],
            timestamp: Date.now(),
          },
        ]);
        lineIndex++;
      } else {
        clearInterval(bootTimer);
        setIsTyping(false);
      }
    }, 400);

    return () => clearInterval(bootTimer);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  // Auto-scroll terminal to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Hidden console debug message for advanced users
  useEffect(() => {
    const styles = [
      "color: #00ff00",
      "background: #000",
      "font-family: monospace",
      "font-size: 12px",
      "text-shadow: 0 0 5px #00ff00",
    ].join(";");

    console.log("%cRETRO CYBER DEBUG LOG v1.337", styles);
    console.log("%c[HIDDEN] Memory fragment detected in heap:", styles);
    console.log("%c0x2A7F: FRAGMENT_BETA location confirmed", styles);
    console.log(
      "%cFor advanced users: This is just one piece of the puzzle...",
      styles
    );
  }, []);

  // Handle command input and output
  const handleCommand = (input) => {
    const [command, ...args] = input.toLowerCase().trim().split(" ");

    // Add user input to history
    setTerminalHistory((prev) => [
      ...prev,
      {
        type: "input",
        content: `${
          isAuthenticated ? "root" : "guest"
        }@retro_cyber:~$ ${input}`,
        timestamp: Date.now(),
      },
    ]);

    let output = [];

    // Special password handling
    if (command === "login" || (command === "su" && args[0] === "root")) {
      output = commands.login(args);
    } else if (commands[command]) {
      output = commands[command](args);
    } else if (input.trim() === "") {
      output = [];
    } else {
      // Suggest similar commands if not found
      const suggestions = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(command.charAt(0))
      );
      output = [
        `Bad command or file name: '${command}'`,
        suggestions.length > 0
          ? `Did you mean: ${suggestions.join(", ")}?`
          : "",
        "",
        "Type 'help' for available commands.",
      ].filter(Boolean);
    }

    // Add output to history
    if (output.length > 0) {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          content: output.join("\n"),
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // Handle form submit for command input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  const handleClose = () => {
    setShow404(true);
  };

  if (show404) {
    return (
      <div className="zoom-wrapper">
        <div className="cyber-terminal" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <div style={{ textAlign: "center", width: "100%" }}>
            <h1 style={{ color: "#ff0040", fontSize: "2.5rem", marginBottom: "1rem" }}>404</h1>
            <p style={{ color: "#00ff00", fontSize: "1.2rem" }}>Not Found</p>
            <p style={{ color: "#fff" }}>The system could not locate the requested resource.<br />Press F5 to restart the terminal.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zoom-wrapper">
      <div className="cyber-terminal">
        {/* Terminal window header */}
        <div className="terminal-header">
          <div className="terminal-title-bar">
            <span className="terminal-title">CYBER_TERMINAL_v1.337.90</span>
            <div className="window-controls">
              <button className="control-btn minimize">_</button>
              <button className="control-btn maximize">□</button>
              <button className="control-btn close" onClick={handleClose}>×</button>
            </div>
          </div>
        </div>

        {/* Terminal output/history area */}
        <div className="terminal-body" ref={terminalRef}>
          {terminalHistory.map((entry, index) => (
            <div
              key={index}
              className={`terminal-line ${entry.type}`}
              data-timestamp={entry.timestamp}
            >
              <pre>{entry.content}</pre>
            </div>
          ))}

          {/* Terminal input line */}
          <div className="input-line">
            <span className="prompt">
              {isAuthenticated ? "root" : "guest"}@retro_cyber:~$
            </span>
            <div className="input-container">
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className="terminal-input"
                  autoFocus
                  disabled={isTyping}
                />
              </form>
              <div className="input-display">
                {currentInput}
                {showCursor && <span className="cursor">█</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Status bar with hidden fragment on hover */}
        <div className="status-bar">
          <span>RETRO CYBER WORLD BBS</span>
          <span
            className="user-status"
            onMouseEnter={() => setShowGammaHint(true)}
            onMouseLeave={() => setShowGammaHint(false)}
            style={{ cursor: "pointer" }}
          >
            {isAuthenticated
              ? showGammaHint
                ? "31337" // Show fragment when hovered
                : "USER: ROOT"
              : "USER: GUEST"}
          </span>
          <span>BAUD: 9600</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Visual overlays for CRT/glitch effects */}
        <div className="glitch-overlay"></div>
        <div className="scanlines"></div>
      </div>
    </div>
  );
}

export default App;
