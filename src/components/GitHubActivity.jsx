import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './GitHubActivity.css'

const PROFILE_API = 'https://api.github.com/users/yaash-git'
const REPOSITORIES_API = 'https://api.github.com/users/yaash-git/repos?sort=updated&per_page=6'
const PROFILE_URL = 'https://github.com/yaash-git'

gsap.registerPlugin(ScrollTrigger)

function GitHubActivity() {
  const sectionRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [repositories, setRepositories] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    const section = sectionRef.current

    async function loadGitHubData() {
      try {
        setStatus('loading')

        // Fetch the public profile and its recently updated repositories.
        const [profileResponse, repositoriesResponse] = await Promise.all([
          fetch(PROFILE_API, { signal: controller.signal }),
          fetch(REPOSITORIES_API, { signal: controller.signal }),
        ])

        if (!profileResponse.ok || !repositoriesResponse.ok) {
          throw new Error('GitHub returned an unsuccessful response.')
        }

        // Convert each response body into JavaScript data for React state.
        const profileData = await profileResponse.json()
        const repositoriesData = await repositoriesResponse.json()

        setProfile(profileData)
        setRepositories(Array.isArray(repositoriesData) ? repositoriesData : [])
        setStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setStatus('error')
      }
    }

    if (!section || !('IntersectionObserver' in window)) {
      loadGitHubData()
      return () => controller.abort()
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return

      observer.disconnect()
      loadGitHubData()
    }, { rootMargin: '300px 0px' })

    observer.observe(section)
    return () => {
      observer.disconnect()
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (status !== 'success' || !sectionRef.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.from('.github-activity__header, .github-activity__repo', {
        autoAlpha: 0,
        y: 16,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [status])

  const profileName = profile?.name || profile?.login

  return (
    <section className="github-activity" aria-labelledby="github-activity-title" ref={sectionRef}>
      <div className="github-activity__inner">
        <header className="github-activity__header">
          <div>
            <p className="github-activity__eyebrow">CODE / IN PUBLIC</p>
            <h2 id="github-activity-title">GITHUB / ACTIVITY</h2>
          </div>

          {status === 'success' && profile && (
            <div className="github-activity__profile">
              <p className="github-activity__name">{profileName}</p>
              <p className="github-activity__login">@{profile.login}</p>
              <p className="github-activity__count">
                {profile.public_repos} public {profile.public_repos === 1 ? 'repository' : 'repositories'}
              </p>
              <a className="github-activity__profile-link" href={PROFILE_URL} target="_blank" rel="noreferrer">
                VIEW GITHUB PROFILE <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </header>

        <div className="github-activity__content" aria-live="polite">
          {status === 'loading' && (
            <p className="github-activity__message" role="status">Loading public GitHub data…</p>
          )}

          {status === 'error' && (
            <div className="github-activity__message" role="alert">
              <p>GitHub data could not be loaded right now. Please try again later.</p>
              <a className="github-activity__profile-link" href={PROFILE_URL} target="_blank" rel="noreferrer">
                VIEW GITHUB PROFILE <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          {status === 'success' && repositories.length === 0 && (
            <p className="github-activity__message" role="status">
              No public repositories were returned by GitHub.
            </p>
          )}

          {status === 'success' && repositories.length > 0 && (
            <ol className="github-activity__list">
              {repositories.map((repository, index) => (
                <li className="github-activity__repo" key={repository.id}>
                  <span className="github-activity__number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="github-activity__repo-main">
                    <h3>{repository.name}</h3>
                    {repository.description && <p>{repository.description}</p>}
                    {repository.updated_at && (
                      <p className="github-activity__updated">
                        Updated {new Date(repository.updated_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  <div className="github-activity__repo-meta">
                    {repository.language && <span>{repository.language}</span>}
                    {typeof repository.stargazers_count === 'number' && <span>★ {repository.stargazers_count}</span>}
                    {typeof repository.forks_count === 'number' && <span>⑂ {repository.forks_count}</span>}
                  </div>
                  {repository.html_url && (
                    <a
                      className="github-activity__repo-link"
                      href={repository.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${repository.name} on GitHub`}
                    >
                      VIEW REPOSITORY <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}

export default GitHubActivity
