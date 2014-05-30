@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

IF "%ENDPOINT_TYPE%" == "client" (
  deploy.client.cmd
) ELSE (
  IF "%ENDPOINT_TYPE%" == "server" (
    deploy.server.cmd
  ) ELSE (
    echo You have to set ENDPOINT_TYPE setting to either "client" or "server"
    exit /b 1
  )
)
