# setup

- go to `rubyinstaller.org/downloads` and download the recommended version
- run the installer with default options
- at the end, keep "run rdik install" checked
- after installation finishes, a console opens. press enter to pick the default option
- check that installation worked: `ruby -v` `gem -v` in terminal
- in terminal `gem install bundler`
- clone the repo `git clone https://github.com/eliassteiner1/resume.git`
- go to repo `cd resume`
- `bundle install`
- run the site `bundle exec jekyll serve --livereload`
- open site at `http://localhost:4000` (potentially with suffix)



TODO: make banner height less convoluted (not height and then padding, plus padding at last element of baecontainer)

some classes for basecontainer (no-header, ..., no-bg, ..)

make clear which sizes are tunable (especially of the bigger ones, like two column split, height photo, height banner, etc)

fix relative url in css for locicon mask! (but how?)