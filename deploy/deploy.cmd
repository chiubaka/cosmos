@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

CALL :endpoint_%ENDPOINT_TYPE%
IF ERRORLEVEL 1 CALL :default

echo done.
exit /b 1

:endpoint_client
	deploy\deploy.client.cmd
  goto end
:endpoint_server
  deploy\deploy.server.cmd
  goto end
:endpoint_docs
  deploy\deploy.docs.cmd
  goto end
:default 
  echo You have to set the ENDPOINT_TYPE setting to 'client', 'server', or 'docs'
  goto :end
:end
  echo Deployment complete!
  goto :EOF
