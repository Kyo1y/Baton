.PHONY: server bot

server:
	@echo "Running on http://localhost:8080"
	python -m server.server

bot:
	python -m bot.main