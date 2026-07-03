all:
	hugo

preview:
	hugo server --navigateToChanged --buildDrafts

check:
	@rm -rf public/
	hugo

bootstrap:
	sudo apt install hugo
	git submodule update --init --recursive

help:
	@echo "Single Page:"
	@echo "hugo new --kind post posts/hello-world.md"
	@echo "Bundle"
	@echo "hugo new --kind bundle posts/2024-23-23-foobar"
