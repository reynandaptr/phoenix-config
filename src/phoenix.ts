Phoenix.set({
  daemon: false,
  openAtLogin: false,
})

type AppState = {
  appName: string
  allowFullScreen: boolean
  screenIdentifier: string
  singleScreenOrder: number
  dualScreenOrder: number
}

const rearrangeWorkspace = (appStates: AppState[], focusApps: string[], screenCnt: number) => {
  const missingApps: string[] = []
  const sortedAppStates: AppState[] = appStates.sort((a, b) => {
    if (screenCnt === 2) {
      return a.dualScreenOrder - b.dualScreenOrder
    }
    return a.singleScreenOrder - b.singleScreenOrder
  })
  sortedAppStates.forEach((appState, i) => {
    const app = App.get(appState.appName)
    if (!app) {
      missingApps.push(appState.appName)
    }
  })

  if (missingApps.length > 0) {
    Phoenix.notify(`Missing apps: ${missingApps.join(', ')}`)
    return
  }

  sortedAppStates.forEach((appState, i) => {
    const app = App.get(appState.appName)
    if (!app) {
      return
    }
    const appMainWindow = app?.mainWindow()
    setTimeout(() => {
      if (appMainWindow.isFullScreen()) {
        appMainWindow.focus()
        appMainWindow.setFullScreen(false)
      }
    }, i * 1000)
  })

  sortedAppStates.forEach((appState, i) => {
    const app = App.get(appState.appName)
    if (!app) {
      return
    }
    const appMainWindow = app?.mainWindow()
    setTimeout(() => {
      moveApp(appState, appMainWindow, screenCnt)
    }, (i + sortedAppStates.length) * 1000)
  })

  sortedAppStates.forEach((appName, i) => {
    const app = App.get(appName.appName)
    if (!app) {
      return
    }
    const appMainWindow = app?.mainWindow()
    setTimeout(() => {
      if (appName.allowFullScreen) {
        appMainWindow.focus()
        appMainWindow.setFullScreen(true)
      } else {
        appMainWindow.maximize()
      }
      if (i === sortedAppStates.length - 1) {
        setTimeout(() => {
          Phoenix.notify('Finish Rearrange Workspace')
          console.log('Finish Rearrange Workspace')
          console.log(new Date().toLocaleTimeString())
          postRearrangeWorkspace(focusApps, screenCnt)
        }, 1000);
      }
    }, (i + sortedAppStates.length * 2) * 1000)
  })
}

const moveApp = (appStates: AppState, appMainWindow: Window, screenCnt: number) => {
  if (screenCnt === 1) {
    Space.all().forEach(space => {
      // @ts-ignore
      space.moveWindows([appMainWindow])
      return
    })
  } else {
    Space.all().forEach(space => {
      if (space?.screens()[0]?.identifier() === appStates.screenIdentifier) {
        // @ts-ignore
        space.moveWindows([appMainWindow])
        return
      }
    })
  }
}

const postRearrangeWorkspace = (focusApps: string[], screenCnt: number) => {
  focusApps.forEach((focusApp, i) => {
    if (screenCnt === 1 && i > 0) {
      return
    }
    const app = App.get(focusApp)
    if (!app) {
      return
    }
    const appMainWindow = app?.mainWindow()
    setTimeout(() => {
      appMainWindow.focus()
    }, i * 1000)
  })
}

// Key.on('w', ['command', 'control', 'shift'], () => {
const run = () => {
  const mainScreenIdentifier = '37D8832A-2D66-02CA-B9F7-8F30A301B230'
  const secondScreenIdentifier = 'E554CC5F-E7D1-9A9F-0857-D6964E3302DB'

  const screenCnt = Screen.all().length
  const checkScreenIdentifier = screenCnt === 2 ? secondScreenIdentifier : mainScreenIdentifier

  const defaultBrowser = 'Arc'
  const focusApps = ['Slack', defaultBrowser]
  const appState: AppState[] = [
    {
      allowFullScreen: true,
      appName: 'Postman',
      screenIdentifier: mainScreenIdentifier,
      singleScreenOrder: 0,
      dualScreenOrder: 2
    },
    {
      allowFullScreen: true,
      appName: 'DataGrip',
      screenIdentifier: mainScreenIdentifier,
      singleScreenOrder: 1,
      dualScreenOrder: 1
    },
    {
      allowFullScreen: true,
      appName: 'Code',
      screenIdentifier: checkScreenIdentifier,
      singleScreenOrder: 2,
      dualScreenOrder: 4
    },
    {
      allowFullScreen: screenCnt === 2 ? false : true,
      appName: defaultBrowser,
      screenIdentifier: checkScreenIdentifier,
      singleScreenOrder: 3,
      dualScreenOrder: 3
    },
    {
      allowFullScreen: true,
      appName: 'Slack',
      screenIdentifier: mainScreenIdentifier,
      singleScreenOrder: 4,
      dualScreenOrder: 0
    },
    {
      allowFullScreen: true,
      appName: 'Stoplight Studio',
      screenIdentifier: checkScreenIdentifier,
      singleScreenOrder: 5,
      dualScreenOrder: 5
    },
    {
      allowFullScreen: true,
      appName: 'Telegram',
      screenIdentifier: checkScreenIdentifier,
      singleScreenOrder: 6,
      dualScreenOrder: 6
    },
  ]
  Phoenix.notify('Start Rearrange Workspace')
  console.log('Start Rearrange Workspace')
  console.log(new Date().toLocaleTimeString())
  rearrangeWorkspace(appState, focusApps, screenCnt)
}
// })

run()
