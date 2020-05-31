const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./hugo_stats.json'],
  defaultExtractor: (content) => {
    let els = JSON.parse(content).htmlElements;
    els.classes.push('testimonials__testimonial--expanded', 'expanded');
    return els.tags.concat(els.classes, els.ids);
  }
});

module.exports = {
  plugins: [
    require('autoprefixer'),
    purgecss,
  ]
}
