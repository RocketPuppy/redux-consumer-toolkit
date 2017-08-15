HTML=../docs

.PHONY: markdown dirs

markdown: dirs
	lit --weave -odir $(HTML) *.lit
	lit --weave -odir $(HTML) */*.lit

dirs:
	mkdir -p $(HTML)
