MARKDOWN=markdown
HTML=html

.PHONY: markdown dirs clean

markdown: dirs
	lit --weave -odir $(HTML) *.lit
	lit -odir $(HTML) */*.lit
	find $(HTML) -name \*.html -type f -exec pandoc -f html -t commonmark -o $(MARKDOWN)/{}.md {} \;
	mv $(MARKDOWN)/$(HTML)/* $(MARKDOWN)/
	rm -rf $(MARKDOWN)/$(HTML)
	find $(MARKDOWN)/ -name \*.md -type f -execdir sh -c 'mv "$$1" "$$(basename -s .html.md "$$1").md"' sh "{}" \;
	find $(MARKDOWN)/ -name \*.md -type f -execdir sed -i "s/(\(.*\)\.html)/(\1.md)/" {} \;
	mv $(HTML)/*.js $(MARKDOWN)

dirs:
	mkdir -p $(HTML)
	mkdir -p $(MARKDOWN)/_book
	mkdir -p $(MARKDOWN)/html/_book

clean:
	rm -rf html markdown
