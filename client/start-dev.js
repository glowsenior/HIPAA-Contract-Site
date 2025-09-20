const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.GENERATE_SOURCEMAP = 'false';
process.env.DANGEROUSLY_DISABLE_HOST_CHECK = 'true';
process.env.WDS_SOCKET_HOST = 'localhost';
process.env.WDS_SOCKET_PORT = '3000';

// Start the React development server
const child = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

child.on('error', (error) => {
  console.error('Failed to start development server:', error);
});

child.on('exit', (code) => {
  console.log(`Development server exited with code ${code}`);
});
