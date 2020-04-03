const path = require('path')
const root = process.env.PWD
const docgen = require('react-docgen')
const pkgVersion = require(`${root}/package.json`).version
const docgenDisplayNameHandler = require('react-docgen-displayname-handler')

module.exports = {
  // #region preferences
  title: 'Ivory components',
  version: `v${pkgVersion}`,
  assetsDir: `${root}/src/styleguide/assets`,
  template: {
    favicon: 'favicon.ico',
    head: {
      links: [
        {
          rel: 'stylesheet',
          type: 'text/css',
          href:
            'https://fonts.googleapis.com/css?family=Rubik:300,400,700|Open+Sans:300,400'
        },
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    },
    trimWhitespace: true
  },
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: 'Rubik, sans-serif, -apple-system, BlinkMacSystemFont'
      }
    }
  },
  styleguideDir: `${root}/stylebuild`,
  skipComponentsWithoutExample: true,
  getExampleFilename (componentPath) {
    return componentPath.replace(/(\.[a-zA-Z]+)?(.jsx|.js)$/, '.mdx')
  },
  getComponentPathLine (componentPath) {
    const name = path.basename(componentPath, '.js')
    const trimmedName = name.split('.')[0]
    return `import { ${trimmedName} } from @shared-utils/components`
  },
  // #endregion
  // #region config
  compilerConfig: {
    objectAssign: 'Object.assign',
    transforms: {
      modules: false,
      dangerousTaggedTemplateString: true
    }
  },
  webpackConfig: require('react-scripts/config/webpack.config')('development'),
  moduleAliases: {
    moment: path.resolve(root, 'node_modules/moment'),
    '@kogaio': path.resolve(root, 'node_modules/@ivoryio/kogaio'),
    '@reach/router': path.resolve(root, 'node_modules/@reach/router'),
    '@shared-utils/api': path.resolve(root, 'src/packages/@shared-utils/api'),
    '@shared-utils/components': path.resolve(
      root,
      'src/packages/@shared-utils/components'
    ),
    '@shared-utils/hooks': path.resolve(
      root,
      'src/packages/@shared-utils/hooks'
    ),
    '@shared-utils/funcs': path.resolve(
      root,
      'src/packages/@shared-utils/funcs'
    )
  },
  handlers: componentPath =>
    require('react-docgen').defaultHandlers.concat(
      (documentation, path) => {
        const {
          value: { type, id },
          parentPath
        } = path
        // Calculate a display name for components based upon the declared class name.
        if (type === 'ClassDeclaration' && type === 'Identifier') {
          documentation.set('displayName', id.name)

          // Calculate the key required to find the component in the module exports
          if (parentPath.value.type === 'ExportNamedDeclaration') {
            documentation.set('path', id.name)
          }
        }

        // The component is the default export
        if (parentPath.value.type === 'ExportDefaultDeclaration') {
          documentation.set('path', 'default')
        }
      },
      require('react-docgen-external-proptypes-handler')(componentPath),
      docgenDisplayNameHandler.createDisplayNameHandler(componentPath)
    ),
  propsParser (filePath, source, resolver, handlers) {
    return docgen.parse(source, resolver, handlers)
  },
  styleguideComponents: {
    Wrapper: path.join(root, 'src/styleguide/Wrapper')
  },
  // #endregion
  // #region sidemenu
  sections: [
    {
      name: 'Components',
      sections: [
        {
          name: 'Buttons',
          components: `${root}/src/packages/@shared-utils/components/Buttons/*.{js,jsx}`
        },
        {
          name: 'Form',
          components: `${root}/src/packages/@shared-utils/components/Form/*.{js,jsx}`
        },
        {
          name: 'Inputs',
          components: `${root}/src/packages/@shared-utils/components/Inputs/**/*.{js,jsx}`
        },
        {
          name: 'Labels',
          components: `${root}/src/packages/@shared-utils/components/Labels/*.{js,jsx}`
        },
        {
          name: 'Modals',
          components: `${root}/src/packages/@shared-utils/components/Modals/**/*.{js,jsx}`
        },
        {
          name: 'Skeletons',
          components: `${root}/src/packages/@shared-utils/components/Skeletons/*.{js|jsx}`
        },
        {
          name: 'Tabs',
          components: `${root}/src/packages/@shared-utils/components/Tabs/*.{js,jsx}`
        },
        {
          name: 'Other',
          components: `${root}/src/packages/@shared-utils/components/*.{js,jsx}`
        }
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse' // 'hide' | 'collapse' | 'expand'
    }
  ]
  // #endregion
}
