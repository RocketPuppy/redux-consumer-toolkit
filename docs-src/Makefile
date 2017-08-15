HTML=../docs

.PHONY: markdown dirs

markdown: clean dirs
	lit --weave -odir $(HTML) *.lit
	lit --weave -odir $(HTML) */*.lit

dirs:
	mkdir -p $(HTML)
	touch $(HTML)/.nojekyll

clean:
	rm -rf $(HTML)
